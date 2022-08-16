import { Injectable } from "@angular/core";
import { BehaviorSubject, filter, scan, map, Observable, Subject, combineLatest, switchMap } from "rxjs";
import { Position } from "./position";

@Injectable({
    providedIn: 'root'
})
export class BoardService {
    clickedPosition$$ = new Subject<Position>();
    items$ = new BehaviorSubject<Position[]>([]);
    zoom$ = new Observable<number>();
    zoomTranslation$ = new BehaviorSubject<number>(100);

    constructor() {
        this.zoom$ = this.zoomTranslation$.pipe(
            scan((acc, curr) => acc + curr),
            filter(zoom => zoom <= 200 && zoom >= 100),
        )

        combineLatest([this.zoom$]).pipe(
            map(([zoom]) => zoom / 100),
            switchMap(zoom => this.clickedPosition$$.pipe(
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
