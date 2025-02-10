import { PreloadAllModules, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

export class SelectivePreloadStrategy implements PreloadAllModules {
    preload(route: Route, load: () => Observable<any>): Observable<any> {
        return route.data?.['preload'] === true ? load() : of(null);
    }
}