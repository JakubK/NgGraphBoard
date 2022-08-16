import { Injectable } from "@angular/core";
import { BehaviorSubject, filter, scan, map, Observable, Subject, combineLatest, switchMap, tap } from "rxjs";
import { CursorMode } from "../models/cursorMode";
import { Position } from "../models/position";
import { CursorService } from "./cursor.service";

@Injectable({
    providedIn: 'root'
})
export class BoardService {
    clickedPosition$$ = new Subject<Position>();
    items$ = new BehaviorSubject<Position[]>([]);
    zoom$ = new Observable<number>();
    zoomTranslation$ = new BehaviorSubject<number>(100);

    constructor(private cursorService: CursorService) {
        this.zoom$ = this.zoomTranslation$.pipe(
            scan((acc, curr) => acc + curr),
            filter(zoom => zoom <= 200 && zoom >= 100),
        )
            
        combineLatest([this.zoom$, cursorService.activeCursorMode$$]).pipe(
            map(([zoom, mode]) => [zoom / 100, mode]),
            switchMap(([zoom, mode]) => this.clickedPosition$$.pipe(
                filter(() => mode === CursorMode.AddNode),
                map(clickedPos => ({
                    x: clickedPos.x / zoom,
                    y: clickedPos.y / zoom
                }))
            )),
        ).subscribe(pos => this.addNode(pos));
    }

    private addNode(x: Position): void {
        this.items$.next([...this.items$.value, x]);
    }
}
