import { Injectable } from "@angular/core";
import { BehaviorSubject, filter, scan, map, Observable, Subject, combineLatest, switchMap, take, toArray, repeat, fromEvent, withLatestFrom } from "rxjs";
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
    clickedEdges$$ = new Subject<Edge>();

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
                filter(delta => (delta > 0 && zoom < 200) || (delta < 0 && zoom > 100))
            ))
        ).subscribe(delta => this.zoomTranslation$.next(delta))
        
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

          cursorService.activeCursorMode$$.pipe(
            switchMap(mode => cursorService.clickedNodes$$.pipe(
              filter(() => mode === CursorMode.Delete),
              withLatestFrom(this.nodes$),
              map(x => ({
                toDelete: x[0],
                nodes: x[1]
              })),
              map(({nodes, toDelete}) =>({
                rest: nodes.filter(node => !(node.position.x === toDelete.position.x && node.position.y === toDelete.position.y)),
                nodes,
                toDelete
              })),
              withLatestFrom(this.edges$),
              map(x => ({
                nodeData: x[0],
                edges: x[1]
              })),
              map(({edges, nodeData}) => ({
                restEdges: edges.filter(x => 
                    !(x.p1.x === nodeData.toDelete.position.x && x.p1.y === nodeData.toDelete.position.y 
                    || x.p2.x === nodeData.toDelete.position.x && x.p2.y === nodeData.toDelete.position.y)
                ),
                nodeData
              }))
            ))).subscribe(x => {
                this.nodes$.next(x.nodeData.rest);
                this.edges$.next(x.restEdges);
            });


            cursorService.activeCursorMode$$.pipe(
                switchMap(mode => this.clickedEdges$$.pipe(
                  filter(() => mode === CursorMode.Delete),
                  withLatestFrom(this.edges$),
                  map(x => ({
                    toDelete: x[0],
                    edges: x[1],
                  })),
                  map(({edges, toDelete}) => ({
                    rest: edges.filter(edge => 
                        !(edge.p1.x === toDelete.p1.x && edge.p1.y === toDelete.p1.y && 
                        edge.p2.x === toDelete.p2.x && edge.p2.y === toDelete.p2.y)   
                    ),
                }))))).subscribe(({rest}) => {
                    this.edges$.next(rest);
                });
    }

    private addNode(x: Position): void {
        this.nodes$.next([...this.nodes$.value, {position: x, edges: []}]);
    }
}
