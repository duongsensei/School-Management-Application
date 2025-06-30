import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

// Import Syncfusion license registration
import { registerLicense } from '@syncfusion/ej2-base';

// Register Syncfusion license key (thay YOUR-LICENSE-KEY bằng key thật)
// Để lấy free license key: https://www.syncfusion.com/products/communitylicense
registerLicense('@32392e302e303b32393bfIB10Ehs/S4ckqumjiJPkRPkNxk5VJgXYYEtoQseh34=');

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
