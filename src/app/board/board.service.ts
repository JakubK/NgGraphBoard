import { Injectable } from "@angular/core";
import { Observable, of, Subject } from "rxjs";
import { Position } from "./position";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class BoardService {
    clickedPosition$$ = new Subject<Position>();
    items$ = new Observable<Position[]>();

    constructor() {
        this.items$ = of([]);
        this.clickedPosition$$.subscribe(x => this.addNode(x));
    }

    addNode(x: Position): void {
        this.items$ = this.items$.pipe(
            map(items => ([...items, x]))
        );
    }
}
