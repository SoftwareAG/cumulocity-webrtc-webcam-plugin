import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Permissions } from '@c8y/ngx-components';
import { SignalingService } from './signaling.service';

@Injectable({ providedIn: 'root' })
export class WebcamGuard implements CanActivate {
  constructor(
    private signaling: SignalingService,
    private permissions: Permissions
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.permissions.hasAllRoles(['ROLE_REMOTE_ACCESS_ADMIN'])) {
      return false;
    }
    const contextData = route.data.contextData || route.parent.data.contextData;
    const { c8y_SupportedOperations: supportedOperations } = contextData;
    if (!supportedOperations || !Array.isArray(supportedOperations)) {
      return false;
    }
    if (!supportedOperations.includes('c8y_RemoteAccessConnect')) {
      return false;
    }

    return !!this.signaling.extractRCAIdFromDevice(contextData);
  }
}
