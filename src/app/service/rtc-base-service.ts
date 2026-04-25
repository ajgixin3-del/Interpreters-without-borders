import { inject, signal, Signal, WritableSignal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import {
  AudioCallback,
  MatchingStatus,
  WsAccepTranslatorMsgContent,
  WsCandidateMsgContent,
  WsFindTranslatorMsgContent,
  WsOfferTranslationMsgContent,
} from '../business-types';

export abstract class RtcBaseService {
  private readonly window: WindowProxy = inject(DOCUMENT).defaultView!;
  private readonly mediaDevices: MediaDevices = this.window.navigator.mediaDevices;

  protected wsConnection: WebSocket;
  protected peerConnection?: RTCPeerConnection;
  protected dataChannel?: RTCDataChannel;
  private pendingCandidates: RTCIceCandidateInit[] = [];
  protected rtcEstablishedSignal: WritableSignal<MatchingStatus> = signal<MatchingStatus>(
    MatchingStatus.NOT_STARTED,
  );

  protected constructor(websocketUrl: string) {
    this.wsConnection = new WebSocket(websocketUrl);

    this.wsConnection.onopen = (): void => {
      this.initializeWebRTC();
    };

    this.window.addEventListener('beforeunload', () => {
      if (this.dataChannel?.readyState == 'open') {
        this.dataChannel.close();
      }
    });
  }

  public rtcEstablished(): Signal<MatchingStatus> {
    return this.rtcEstablishedSignal.asReadonly();
  }

  public listenAudioFromRemote(callback: AudioCallback): void {
    this.peerConnection!.ontrack = callback;
  }

  protected sendViaWs(
    message:
      | WsFindTranslatorMsgContent
      | WsAccepTranslatorMsgContent
      | WsOfferTranslationMsgContent
      | WsCandidateMsgContent,
  ): void {
    this.wsConnection.send(JSON.stringify(message));
  }

  protected async handleCandidate(candidate: RTCLocalIceCandidateInit): Promise<void> {
    if (!candidate) return;

    if (this.peerConnection!.remoteDescription?.type) {
      await this.peerConnection!.addIceCandidate(new RTCIceCandidate(candidate));
    } else {
      this.pendingCandidates.push(candidate);
    }
  }

  protected async flushPendingCandidates(): Promise<void> {
    while (this.pendingCandidates.length > 0) {
      const candidate = this.pendingCandidates.shift();
      await this.peerConnection!.addIceCandidate(new RTCIceCandidate(candidate));
    }
    this.rtcEstablishedSignal.set(MatchingStatus.SUCCESS);
  }

  private initializeWebRTC(): void {
    this.peerConnection = new RTCPeerConnection();
    this.peerConnection.onicecandidate = (iceCandidate: RTCPeerConnectionIceEvent): void => {
      this.sendViaWs({
        eventType: 'register-candidate',
        iceCandidate: iceCandidate.candidate,
      });
    };

    this.dataChannel = this.peerConnection.createDataChannel('dataChannel');
    this.dataChannel.onclose = (): void => {
      this.rtcEstablishedSignal.set(MatchingStatus.END);
    };

    this.peerConnection.ondatachannel = (event: RTCDataChannelEvent): void => {
      this.dataChannel = event.channel;
    };

    this.streamAudioToRemote();
  }

  private async streamAudioToRemote(): Promise<void> {
    const localStream: MediaStream = await this.mediaDevices.getUserMedia({ audio: true });
    localStream.getAudioTracks().forEach((track: MediaStreamTrack) => {
      this.peerConnection!.addTrack(track, localStream);
    });
  }
}
