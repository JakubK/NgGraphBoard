import { Injectable } from "@angular/core";
import { BehaviorSubject, filter, scan, map, Observable, Subject, combineLatest, switchMap, take, toArray, repeat, fromEvent, throttle, takeUntil, takeWhile } from "rxjs";
import { CursorMode } from "../models/cursorMode";
import { Edge } from "../models/edge";
import { Node } from "../models/node";
import { Position } from "../models/position";
import { CursorService } from "./cursor.service";

@Injectable({
    providedIn: 'root'
})
export class BoardService {
    clickedPosition$$ = new Subject<Position>();
    nodes$ = new BehaviorSubject<Node[]>([]);
    edges$ = new BehaviorSubject<Edge[]>([]);

    zoom$ = new Observable<number>();
    zoomTranslation$ = new BehaviorSubject<number>(100);

    constructor(cursorService: CursorService) {
        this.zoom$ = this.zoomTranslation$.pipe(
            scan((acc, curr) => acc + curr),
            filter(zoom => zoom <= 200 && zoom >= 100),
        )

        const scroll$ = fromEvent(window, 'wheel').pipe(
            map(e => (e as WheelEvent).deltaY),
            map(delta => -delta / Math.abs(delta)),
        );

        this.zoom$.pipe(
            switchMap(zoom => scroll$.pipe(
                filter(delta =>  (delta > 0 && zoom < 200) || (delta < 0 && zoom > 100)),
            ))
        ).subscribe(delta => {
            this.zoomTranslation$.next(delta);
        })
        
        combineLatest([this.zoom$, cursorService.activeCursorMode$$]).pipe(
            switchMap(([zoom, mode]) => this.clickedPosition$$.pipe(
                filter(() => mode === CursorMode.AddNode),
                map(clickedPos => ({
                    x: clickedPos.x / (zoom / 100),
                    y: clickedPos.y / (zoom / 100)
                }))
            )),
        ).subscribe(pos => this.addNode(pos));

        cursorService.activeCursorMode$$.pipe(
            switchMap(mode => cursorService.clickedNodes$$.pipe(
              filter(() => mode === CursorMode.AddEdge),
              map(node => ({...node, x: node.position.x + 24, y: node.position.y + 24})),
              take(2),
              toArray(),
              repeat()
            ))
          )
          .subscribe(([first, second]) => {
            this.edges$.next([...this.edges$.value,{
                p1: first,
                p2: second
            } ]);
          });
    }

    private addNode(x: Position): void {
        this.nodes$.next([...this.nodes$.value, {position: x, edges: []}]);
    }
}
