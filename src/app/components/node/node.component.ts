import { Component, Input, OnInit } from '@angular/core';
import { CursorService } from 'src/app/services/cursor.service';
import { Position } from '../../models/position';

@Component({
  selector: 'node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit {
  @Input()
  position!: Position;

  constructor(private readonly cursorService: CursorService) { }

  ngOnInit(): void {
  }

  nodeClick(e: MouseEvent): void {
    this.cursorService.switchToPointer();
    e.stopPropagation();
  }
}
