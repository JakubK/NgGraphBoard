import { Component, ElementRef, OnInit } from '@angular/core';
import { animationFrameScheduler, filter, fromEvent, scan, map, Observable, subscribeOn, switchMap, takeUntil, pairwise, combineLatest, startWith, shareReplay, withLatestFrom } from 'rxjs';
import { CursorMode } from 'src/app/models/cursorMode';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  zoom$: Observable<number>;

  translationX$!: Observable<number>;
  translationY$!: Observable<number>;

  constructor(public readonly boardService: BoardService,
     private readonly host: ElementRef) {
      this.zoom$ = boardService.zoom$.pipe(
        map(zoom => zoom / 100)
      )
  }

  ngOnInit() {
    const mouseMove$: Observable<MouseEvent> = fromEvent(this.host.nativeElement, 'mousemove');
    const mouseUp$ = fromEvent(this.host.nativeElement, 'mouseup');
    const mouseDown$ = fromEvent(this.host.nativeElement, 'mousedown');

    const move$ = (start: MouseEvent) => mouseMove$.pipe(
      map((move) => ({left: move.clientX - start.offsetX, top: move.clientY - start.offsetY})),
      takeUntil(mouseUp$)
    )

    const drag$ = mouseDown$.pipe(
      switchMap(start => this.boardService.activeCursorMode$$.pipe(
        filter(mode => mode === CursorMode.MoveCamera),
        switchMap(() => move$(start as MouseEvent)),
        subscribeOn(animationFrameScheduler),
        takeUntil(mouseUp$),
        pairwise(),
        map(([first, second]) => ({
          left: first.left - second.left,
          top: first.top - second.top,
        })),
      )),
    );

    this.translationX$ = drag$.pipe(
      map((translation:{left: number; top: number;}) => translation.left),
      scan((acc,curr) => acc - curr, 0),
      startWith(0),
    )

    this.translationY$ = drag$.pipe(
      map((translation:{left: number; top: number;}) => translation.top),
      scan((acc,curr) => acc - curr, 0),
      startWith(0),
    )

    const translation$ = combineLatest([this.translationX$, this.translationY$]).pipe(
      shareReplay(1)
    );

    fromEvent(this.host.nativeElement, 'click').pipe(
      switchMap((event) => this.boardService.activeCursorMode$$.pipe(
        filter(mode => mode === CursorMode.AddNode),
        withLatestFrom(translation$),
        map(([_,translation]) => [...translation]),
        map(([x,y]) => ({
          x,
          y,
          rect: ((event as Event).target as HTMLElement).getBoundingClientRect()
        })),      
        map(({x,y,rect}) => ({
          x: (event as MouseEvent).clientX - rect.left - 24 - x,
          y: (event as MouseEvent).clientY - rect.top - 24 - y,
        })),
      ))
    ).subscribe(({x,y}) => this.boardService.clickedPosition$$.next({x,y}))
  }
}
