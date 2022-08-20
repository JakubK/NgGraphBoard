import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopBarComponent } from './components/topbar/topbar.component';
import { BoardComponent } from './components/board/board.component';
import { NodeComponent } from './components/node/node.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { EdgeComponent } from './components/edge/edge.component';

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    BoardComponent,
    NodeComponent,
    ToolbarComponent,
    EdgeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
