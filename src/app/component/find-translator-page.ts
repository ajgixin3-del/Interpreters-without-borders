import { Component, ElementRef, inject, Signal, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

import { worldLanguages } from '../world-languages';
import { RtcAnswerService } from '../service/rtc-answer-service';
import { MatchingStatus } from '../business-types';

@Component({
  selector: 'find-translator-page',
  imports: [RouterLink, MatButtonModule, NgOptionTemplateDirective, NgSelectComponent, FormsModule],
  templateUrl: './find-translator-page.html',
  styleUrl: './find-translator-page.scss',
})
export class FindTranslatorPage {
  @ViewChild('audioFromRemote') private audioPlayer!: ElementRef<HTMLAudioElement>;
  private rtcService: RtcAnswerService = inject(RtcAnswerService);

  public readonly languages = worldLanguages;
  public readonly MatchingStatus = MatchingStatus;
  public knownLanguages: string[] = [];
  public requiredLanguages: string[] = [];

  public areLanguagesValid(): boolean {
    return (
      this.knownLanguages.length > 0 &&
      this.requiredLanguages.length > 0 &&
      this.knownLanguages.filter((x) => this.requiredLanguages.includes(x)).length == 0
    );
  }

  public triggerFindTranslator(): void {
    this.rtcService.triggerFindTranslator(this.knownLanguages, this.requiredLanguages);

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
