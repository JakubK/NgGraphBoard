import { Injectable } from "@angular/core";
import { BehaviorSubject, filter, scan, map, Observable, Subject, combineLatest, switchMap } from "rxjs";
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

    constructor(cursorService: CursorService) {
        this.zoom$ = this.zoomTranslation$.pipe(
            scan((acc, curr) => acc + curr),
            filter(zoom => zoom <= 200 && zoom >= 100),
        )
            
        combineLatest([this.zoom$, cursorService.activeCursorMode$$]).pipe(
            switchMap(([zoom, mode]) => this.clickedPosition$$.pipe(
                filter(() => mode === CursorMode.AddNode),
                map(clickedPos => ({
                    x: clickedPos.x / (zoom / 100),
                    y: clickedPos.y / (zoom / 100)
                }))
            )),
        ).subscribe(pos => this.addNode(pos));
    }

    private addNode(x: Position): void {
        this.items$.next([...this.items$.value, x]);
    }
}
