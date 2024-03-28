import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import {registerLicense } from '@syncfusion/ej2-angular-base'

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// registerLicense("Ngo9BigBOggjHTQxAR8/V1NBaF5cXmZCekx0RHxbf1x0ZFRMZFhbRHRPMyBoS35RckVgW31ecXBRRmNYWEV/")
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
