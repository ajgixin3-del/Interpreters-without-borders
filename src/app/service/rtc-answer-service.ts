import { Injectable } from '@angular/core';
import { MatchingStatus, WsCandidateMsgContent, WsMsgContent, WsOfferTranslationMsgContent } from '../business-types';
import { RtcBaseService } from './rtc-base-service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RtcAnswerService extends RtcBaseService {
  constructor() {
    super(`${environment.apiUrl}/find-translator-signal`);

    this.wsConnection.onmessage = (wsTxtMsg: MessageEvent): void => {
      const msgContent: WsMsgContent = JSON.parse(wsTxtMsg.data);
      if (msgContent.eventType === 'offer-translation') {
        this.handleOfferTranslation((msgContent as WsOfferTranslationMsgContent).rtcData);
      } else if (msgContent.eventType == 'register-candidate') {
        this.handleCandidate((msgContent as WsCandidateMsgContent).iceCandidate!);
      }
    };
  }

  public triggerFindTranslator(understoodLanguages: string[], requiredLanguages: string[]): void {
    this.rtcEstablishedSignal.set(MatchingStatus.IN_PROGRESS);

    this.sendViaWs({
      eventType: 'find-translator',
      translationNeed: {
        understoodLanguages: understoodLanguages,
        requiredLanguages: requiredLanguages,
      },
    });
  }

  private async handleOfferTranslation(offerRtcDescr: RTCSessionDescriptionInit): Promise<void> {
    await this.peerConnection!.setRemoteDescription(new RTCSessionDescription(offerRtcDescr));
    await this.flushPendingCandidates();

    const anwserRtcDescr: RTCSessionDescriptionInit = await this.peerConnection!.createAnswer();
    await this.peerConnection!.setLocalDescription(anwserRtcDescr);

    this.sendViaWs({
      eventType: 'accept-translator',
      rtcData: anwserRtcDescr,
    });
  }
}
