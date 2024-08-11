import { Injector, Optional, SkipSelf } from '@angular/core';
import { ControlContainer } from '@angular/forms';

/**
 * This provider connects child components' form controls to their parent form group.
 * It ensures that the parent form group is available in the child components for proper form handling.
 * It uses the ControlContainerService to recursively check for a ControlContainer up to the root.
 *
 * Inspired by: https://nevzatopcu.medium.com/angular-child-components-with-reactive-forms-fbf4563b304c
 *
 */
export const parentFormGroupProvider = [
  {
    provide: ControlContainer,
    useFactory: (
      injector: Injector,
      container: ControlContainer,
    ): ControlContainer => {
      if (!container) {
        throw new Error('Container not found!');
      }

      let parentContainer = injector.get(ControlContainer, null, {
        skipSelf: true,
        optional: true,
      });

      while (parentContainer) {
        if (parentContainer instanceof ControlContainer) {
          return parentContainer;
        }
        parentContainer = injector.get(ControlContainer, null, {
          skipSelf: true,
          optional: true,
        });
      }

      throw new Error('No FormGroup instance found up to root');
    },
    deps: [Injector, [new SkipSelf(), new Optional(), ControlContainer]],
  },
];
