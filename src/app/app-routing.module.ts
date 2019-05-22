import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { PageHeaderComponent } from './pageHeader';

const routes: Routes = [
  { path: '**', redirectTo: 'portfolio' },
  { path: 'portfolio', component: PageHeaderComponent, }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: Boolean(history.pushState) === false,
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
