import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

// Import Syncfusion license registration
import { registerLicense } from '@syncfusion/ej2-base';

// Register Syncfusion license key (thay YOUR-LICENSE-KEY bằng key thật)
// Để lấy free license key: https://www.syncfusion.com/products/communitylicense
registerLicense('Ngo9BigBOggjHTQxAR8/V1NNaF1cWWhMYVB3WmFZfVtgdVdMY19bRnBPMyBoS35Rc0VmW3tecHdWRGZcUU10VEBU');

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
