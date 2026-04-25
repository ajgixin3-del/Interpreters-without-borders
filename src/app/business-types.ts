interface TranslationNeed {
  understoodLanguages: string[];
  requiredLanguages: string[];
}

interface TranslationCapability {
  proficientLanguages: string[];
}

interface WsMsgContent {
  eventType: string;
}

interface WsFindTranslatorMsgContent extends WsMsgContent {
  translationNeed: TranslationNeed;
}

interface WsAccepTranslatorMsgContent extends WsMsgContent {
  rtcData: RTCSessionDescriptionInit;
}

interface WsOfferTranslationMsgContent extends WsMsgContent {
  translationCapability: TranslationCapability;
  rtcData: RTCSessionDescriptionInit;
}

interface WsCandidateMsgContent extends WsMsgContent {
  iceCandidate: RTCIceCandidate | null;
}

type AudioCallback = (trackEvent: RTCTrackEvent) => void;

export enum MatchingStatus {
  NOT_STARTED,
  IN_PROGRESS,
  SUCCESS,
  FAIL,
  END,
}

export type {
  TranslationNeed,
  TranslationCapability,
  WsMsgContent,
  WsFindTranslatorMsgContent,
  WsAccepTranslatorMsgContent,
  WsOfferTranslationMsgContent,
  WsCandidateMsgContent,
  AudioCallback,
};
