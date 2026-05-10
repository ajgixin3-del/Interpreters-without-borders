import { Component, ElementRef, inject, Signal, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

import { RtcOfferService } from '../service/rtc-offer-service';
import { worldLanguages } from '../world-languages';
import { MatchingStatus } from '../business-types';

@Component({
  selector: 'offer-translation-page',
  imports: [RouterLink, MatButtonModule, NgOptionTemplateDirective, NgSelectComponent, FormsModule],
  templateUrl: './offer-translation-page.html',
  styleUrl: './offer-translation-page.scss',
})
export class OfferTranslationPage {
  @ViewChild('audioFromRemote') private audioPlayer!: ElementRef<HTMLAudioElement>;
  private rtcService: RtcOfferService = inject(RtcOfferService);

  public readonly languages = worldLanguages;
  public readonly MatchingStatus = MatchingStatus;
  public knownLanguages: string[] = [];

  public triggerOfferTranslation(): void {
    this.rtcService.triggerOfferTranslation(this.knownLanguages);

    this.rtcService.listenAudioFromRemote((trackEvent: RTCTrackEvent) => {
      if (this.audioPlayer.nativeElement.srcObject !== trackEvent.streams[0]) {
        this.audioPlayer.nativeElement.srcObject = trackEvent.streams[0];
      }
    });
  }

  public get rtcEstablished(): Signal<MatchingStatus> {
    return this.rtcService.rtcEstablished();
  }
}
