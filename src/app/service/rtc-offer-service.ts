import { Injectable } from '@angular/core';

import {
  MatchingStatus,
  WsAccepTranslatorMsgContent,
  WsCandidateMsgContent,
  WsMsgContent,
} from '../business-types';
import { RtcBaseService } from './rtc-base-service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RtcOfferService extends RtcBaseService {
  constructor() {
    super(`${environment.apiUrl}/offer-translation-signal`);

    this.wsConnection.onmessage = (wsTxtMsg: MessageEvent): void => {
      const msgContent: WsMsgContent = JSON.parse(wsTxtMsg.data);
      if (msgContent.eventType === 'accept-translator') {
        this.handleAcceptTranslator((msgContent as WsAccepTranslatorMsgContent).rtcData);
      } else if (msgContent.eventType == 'register-candidate') {
        this.handleCandidate((msgContent as WsCandidateMsgContent).iceCandidate!);
      }
    };
  }

  public async triggerOfferTranslation(languages: string[]): Promise<void> {
    this.rtcEstablishedSignal.set(MatchingStatus.IN_PROGRESS);

    const rtcDescr: RTCSessionDescriptionInit = await this.peerConnection!.createOffer();
    await this.peerConnection!.setLocalDescription(rtcDescr);

    this.sendViaWs({
      eventType: 'offer-translation',
      rtcData: rtcDescr,
      translationCapability: {
        proficientLanguages: languages,
      },
    });
  }

  private async handleAcceptTranslator(rtcDescr: RTCSessionDescriptionInit): Promise<void> {
    await this.peerConnection!.setRemoteDescription(new RTCSessionDescription(rtcDescr));
    await this.flushPendingCandidates();
  }
}
