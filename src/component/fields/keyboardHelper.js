import {useEffect} from "react";

const DEBUG = false; // set true for console logs while debugging

function isVisible(el) {
  if (!el) return false;
  const style = window.getComputedStyle(el);
  return style && style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
}

function isInteractiveTarget(target) {
  if (!target) return false;
  // Common interactive elements where Enter should behave normally
  const interactiveTags = ['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT'];
  if (interactiveTags.includes(target.tagName)) return true;

  // combobox / listbox / contenteditable / role='textbox'
  if (target.getAttribute && (
    target.getAttribute('role') === 'textbox' ||
    target.getAttribute('role') === 'combobox' ||
    target.getAttribute('role') === 'listbox'
  )) return true;

  if (target.isContentEditable) return true;

  // also check if an ancestor is interactive (e.g. custom select renders div inside)
  return !!target.closest('input, textarea, button, select, [role="textbox"], [role="combobox"], [role="listbox"], [contenteditable="true"]');
}

/**
 * Close visible popup on Enter and focus first enabled+visible field.
 * Returns true if it handled the event.
 */
export const handlePopupEnterClose = (event) => {
  try {
    const e = event;
    if (e.key !== 'Enter') return false;

    // If the key event is coming from an interactive control, don't intercept
    if (isInteractiveTarget(e.target)) {
      if (DEBUG) console.log('handlePopupEnterClose: target is interactive — skip');
      return false;
    }

    // find visible dialogs/popups: MUI Dialogs, generic role=dialog, custom success-popups
    const dialogs = Array.from(document.querySelectorAll('.MuiDialog-root, .success-popup, [role="dialog"]'));

    // choose the top-most visible dialog (last in DOM order that is visible)
    const popup = dialogs.reverse().find(isVisible);
    if (!popup) {
      if (DEBUG) console.log('handlePopupEnterClose: no visible popup found — skip');
      return false;
    }

    // If it's a picker/popup that should not be treated as modal close (like MUI datepicker),
    // bail out. This avoids closing datepickers or dropdowns that are implemented as dialogs.
    const popupClass = popup.className || '';
    const popupIsPicker = popupClass.includes('MuiPickers') || popupClass.includes('MuiPickersPopper') ||
                         !!popup.querySelector('[data-mui-popper], .MuiCalendarOrClockPicker-root, .MuiPickersDay-root');
    const popupIsDropdown = !!popup.querySelector('[role="listbox"], [data-test*="singleselectoption"], .rc-virtual-list');

    if (popupIsPicker || popupIsDropdown) {
      if (DEBUG) console.log('handlePopupEnterClose: popup looks like picker/dropdown — skip');
      return false;
    }

    // find a suitable close button inside the popup
    const closeBtn = popup.querySelector(
      "button[aria-label*='close'], button[data-test*='close'], button.MuiButton-root, button"
    );

    if (!closeBtn || !isVisible(closeBtn)) {
      if (DEBUG) console.log('handlePopupEnterClose: no visible closeBtn — skip');
      return false;
    }

    // We will handle it: prevent default and click the close button
    e.preventDefault();
    e.stopPropagation();
    if (DEBUG) console.log('handlePopupEnterClose: closing popup via closeBtn.click()');
    closeBtn.click();

    // after popup closes, focus first enabled & visible field inside the nearest form (or document)
    setTimeout(() => {
      const form = document.querySelector('form') || document.body;
      const candidates = form.querySelectorAll(
        `input:not([disabled]):not([type='hidden']),
         select:not([disabled]),
         textarea:not([disabled]),
         [role='textbox']:not([aria-disabled='true']),
         [aria-haspopup='listbox']:not([aria-disabled='true'])`
      );

      const first = Array.from(candidates).find(isVisible);
      if (first && typeof first.focus === 'function') {
        if (DEBUG) console.log('handlePopupEnterClose: focusing first visible field', first);
        try {
          first.focus({ preventScroll: true });
        } catch (err) {
          // some browsers may not support the options
          first.focus();
        }
      }
    }, 180);

    return true;
  } catch (err) {
    console.error('handlePopupEnterClose error', err);
    return false;
  }
};

export const useKeyboardAccessibility = (tabValue) => {
  useEffect(() => {
    console.log("🔧 Initializing keyboard for tab:", tabValue);
    let popupJustClosed = false;
   
    const handleKeyDown = (e) => {

      // ============================================
      // 🔔 PRIORITY 1: CHECK FOR OPEN POPUPS/MODALS
      // ============================================
      const isPopupOpen = 
        document.querySelector('.swal-modal') ||
        document.querySelector('.swal-overlay:not(.swal-overlay--show-modal)') ||
        document.querySelector('[class*="swal"]:not(.swal-overlay--show-modal)') ||
        document.querySelector('.MuiDialog-root') ||
        document.querySelector('[role="dialog"][aria-hidden="false"]') ||
        document.querySelector('.modal.show') ||
        document.querySelector('[class*="Modal"][style*="display: block"]') ||
        document.querySelector('[class*="popup"][style*="display: block"]');
      
      // Check if popup is actually visible (not just in DOM)
      const isPopupVisible = isPopupOpen && (() => {
        const style = window.getComputedStyle(isPopupOpen);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               style.opacity !== '0';
      })();
      
      if (isPopupVisible && !popupJustClosed) {
        console.log("🔔 Popup detected, handling popup keyboard events");
        
        // Find all buttons in the popup
        const popupButtons = Array.from(
          isPopupOpen.querySelectorAll('button:not([disabled])')
        );
        
        // Handle keyboard events for popup
        switch(e.key) {
          case 'Enter':
          case ' ': {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            console.log("⏎ Enter/Space in popup - closing popup");
            
            // Find and click the primary/focused button
            const focusedButton = document.activeElement;
            
            if (focusedButton && focusedButton.tagName === 'BUTTON' && 
                isPopupOpen.contains(focusedButton)) {
              // Click the focused button
              focusedButton.click();
            } else {
              // Find primary button (OK, Close, Confirm, etc.)
              const primaryButton = popupButtons.find(btn => 
                btn.classList.contains('swal-button--confirm') ||
                btn.classList.contains('swal-button--danger') ||
                btn.classList.contains('MuiButton-containedPrimary') ||
                btn.textContent.toLowerCase().includes('ok') ||
                btn.textContent.toLowerCase().includes('close') ||
                btn.textContent.toLowerCase().includes('yes') ||
                btn.textContent.toLowerCase().includes('confirm')
              ) || popupButtons[popupButtons.length - 1];
              
              if (primaryButton) {
                primaryButton.click();
              }
            }
            
            // Set flag to ignore events briefly after closing
            popupJustClosed = true;
            setTimeout(() => {
              popupJustClosed = false;
              console.log("✅ Popup closed, form navigation re-enabled");
            }, 300);
            
            return;
          }
          
          case 'Escape': {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            console.log("⎋ Escape in popup - closing popup");
            
            // Find cancel/close button
            const cancelButton = popupButtons.find(btn => 
              btn.classList.contains('swal-button--cancel') ||
              btn.textContent.toLowerCase().includes('cancel') ||
              btn.textContent.toLowerCase().includes('close')
            );
            
            if (cancelButton) {
              cancelButton.click();
            } else if (popupButtons.length > 0) {
              popupButtons[0].click();
            }
            
            // Set flag to ignore events briefly after closing
            popupJustClosed = true;
            setTimeout(() => {
              popupJustClosed = false;
              console.log("✅ Popup closed, form navigation re-enabled");
            }, 300);
            
            return;
          }
          
          case 'Tab': {
            // Allow tab within popup but prevent tabbing to underlying form
            e.stopPropagation();
            
            if (popupButtons.length > 1) {
              const focusedButton = document.activeElement;
              const currentIndex = popupButtons.indexOf(focusedButton);
              
              if (currentIndex >= 0) {
                e.preventDefault();
                
                if (!e.shiftKey && currentIndex === popupButtons.length - 1) {
                  popupButtons[0].focus();
                } else if (e.shiftKey && currentIndex === 0) {
                  popupButtons[popupButtons.length - 1].focus();
                } else {
                  const nextIndex = e.shiftKey ? currentIndex - 1 : currentIndex + 1;
                  popupButtons[nextIndex].focus();
                }
              } else {
                e.preventDefault();
                popupButtons[0].focus();
              }
            }
            
            return;
          }
          
          case 'ArrowLeft':
          case 'ArrowRight': {
            if (popupButtons.length > 1) {
              e.preventDefault();
              e.stopPropagation();
              
              const focusedButton = document.activeElement;
              const currentIndex = popupButtons.indexOf(focusedButton);
              
              if (currentIndex >= 0) {
                const nextIndex = e.key === 'ArrowRight' 
                  ? (currentIndex + 1) % popupButtons.length
                  : (currentIndex - 1 + popupButtons.length) % popupButtons.length;
                
                popupButtons[nextIndex].focus();
              } else {
                popupButtons[0].focus();
              }
            }
            
            return;
          }
          
          default:
            // For any other key in popup, prevent propagation to form
            if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
              e.stopPropagation();
              return;
            }
            break;
        }
      }
      
      // Skip form navigation if popup just closed
      if (popupJustClosed) {
        console.log("⏸️ Ignoring key event - popup just closed");
        return;
      }
        
      if (!['ArrowDown', 'ArrowUp', 'Enter', ' ', 'Escape', 'Tab'].includes(e.key)) {
        return;
      }

      const muiAutoickerPickerRoot = 
        e.target.closest('.MuiAutocomplete-input')

      // Check if we're in a DatePicker
      const datePickerRoot = 
        e.target.closest('.MuiPickersPopper-root') ||
        e.target.closest('[class*="DatePicker"]') ||
        e.target.closest('[class*="Picker"]');
      
      const isDatePickerInput = 
        e.target.classList?.contains('MuiInputBase-input') ||
        e.target.closest('.MuiTextField-root') ||
        e.target.closest('.MuiFormControl-root') ||
        e.target.hasAttribute('readonly');

      // Only treat as DatePicker if it has readonly attribute or calendar button
      const isActualDatePicker = 
        !datePickerRoot && // Not already in calendar
        !e.target.closest('.MuiAutocomplete-root') && // Not Autocomplete
        (
          e.target.hasAttribute('readonly') || // Has readonly attribute
          e.target.closest('[class*="DatePicker"]') || // In DatePicker container
          (e.target.parentElement?.querySelector('button[aria-label*="calendar"]') !== null) || // Has calendar button
          (e.target.parentElement?.querySelector('button[aria-label*="date"]') !== null) // Has date button
        );
      
      // Handle DatePicker Enter/Space key
      if ((e.key === 'Enter' || e.key === ' ') && isDatePickerInput && isActualDatePicker && !datePickerRoot && !muiAutoickerPickerRoot) {
        console.log("📅 DatePicker", e.key, "pressed");
        e.preventDefault();
        e.stopPropagation();
        
        // Method 1: Find button in various parent containers
        const findCalendarButton = () => {
          // Try to find the closest form control or field container
          const containers = [
            e.target.closest('.MuiTextField-root'),
            e.target.closest('.MuiFormControl-root'),
            e.target.closest('[class*="TextField"]'),
            e.target.closest('[class*="FormControl"]'),
            e.target.parentElement,
            e.target.parentElement?.parentElement,
            e.target.parentElement?.parentElement?.parentElement
          ].filter(Boolean);
          
          for (const container of containers) {
            // Look for button inside container
            let button = container.querySelector('button[aria-label*="calendar"]') ||
                        container.querySelector('button[aria-label*="date"]') ||
                        container.querySelector('button[aria-label*="picker"]') ||
                        container.querySelector('button.MuiIconButton-root') ||
                        container.querySelector('button svg') && container.querySelector('button') ||
                        container.querySelector('button');
            
            if (button) {
              console.log("✅ Found calendar button in container:", container.className);
              return button;
            }
            
            // Look for button as sibling
            let sibling = container.nextElementSibling;
            while (sibling) {
              button = sibling.querySelector('button') || (sibling.tagName === 'BUTTON' ? sibling : null);
              if (button) {
                console.log("✅ Found calendar button as sibling");
                return button;
              }
              sibling = sibling.nextElementSibling;
            }
            
            // Look for button as previous sibling
            sibling = container.previousElementSibling;
            while (sibling) {
              button = sibling.querySelector('button') || (sibling.tagName === 'BUTTON' ? sibling : null);
              if (button) {
                console.log("✅ Found calendar button as previous sibling");
                return button;
              }
              sibling = sibling.previousElementSibling;
            }
          }
          
          console.log("⚠️ No calendar button found, trying alternatives...");
          return null;
        };
        
        // const calendarButton = findCalendarButton();
        
        // if (calendarButton) {
        //   console.log("📅 Clicking calendar button");
        //   calendarButton.click();
        //   return;
        // }
        
        // Method 2: Dispatch click/mousedown event on input to trigger picker
        console.log("📅 Trying to open picker via input click");
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        e.target.dispatchEvent(clickEvent);
        
        // Method 3: Try mousedown event
        setTimeout(() => {
          const mousedownEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          e.target.dispatchEvent(mousedownEvent);
        }, 50);
        
        return;
      }
      
      const selectRoot =
        e.target.closest('[data-test*="singleselect"]') ||
        e.target.closest('[data-test*="select"]') ||
        e.target.closest('.select-input-wrapper');

      if (!selectRoot) return;
      
      console.log("🎯 Key in dropdown:", e.key);

      const input = selectRoot.querySelector('input') || e.target;

      const getOptions = () => {
        const elements = Array.from(document.querySelectorAll(
          '[data-test*="singleselectoption"], [role="option"], [class*="option"]'
        )).filter(opt => {
          const style = window.getComputedStyle(opt);
          return style.display !== 'none' && opt.offsetParent !== null;
        });
        return elements;
      };

      const focusOption = (option) => {
        if (!option) return;
        getOptions().forEach(o => {
          o.style.backgroundColor = '';
          o.style.outline = '';
        });
        option.style.backgroundColor = '#e3f2fd';
        option.style.outline = '2px solid #1976d2';
        option.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      };

      const findFocusedIndex = () => {
        return getOptions().findIndex(opt =>
          opt.style.backgroundColor === 'rgb(227, 242, 253)'
        );
      };

      const openDropdown = () => {
        console.log("📂 Opening...");
        if (input) input.click();
        else if (selectRoot) selectRoot.click();
        
        setTimeout(() => {
          const first = getOptions()[0];
          if (first) focusOption(first);
        }, 200);
      };

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowUp': {
          e.preventDefault();
          e.stopPropagation();
          
          const options = getOptions();
          if (options.length === 0) {
            openDropdown();
          } else {
            const current = findFocusedIndex();
            const next = e.key === 'ArrowDown'
              ? (current < 0 ? 0 : (current + 1) % options.length)
              : (current <= 0 ? options.length - 1 : current - 1);
            focusOption(options[next]);
          }
          break;
        }

        case 'Enter':
        case ' ': {
          e.preventDefault();
          e.stopPropagation();
          
          const options = getOptions();
          if (options.length === 0) {
            openDropdown();
          } else {
            const idx = findFocusedIndex();
            if (idx >= 0) {
              options[idx].click();
              setTimeout(() => document.body.click(), 100);
            }
          }
          break;
        }

        case 'Escape': {
          e.preventDefault();
          document.body.click();
          if (input) input.focus();
          break;
        }

        // case 'Tab': {
        //   if (getOptions().length > 0) document.body.click();
        //   break;
        // }
        case 'Tab': {
          const options = getOptions();
          if (options.length > 0) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log("⇥ Tab pressed - closing dropdown and moving to next field");
            
            // Close dropdown
            document.body.click();
            
            // Wait for dropdown to close, then move to next field
            setTimeout(() => {
              if (input) {
                const form = input.closest('form');
                if (form) {
                  const focusableElements = Array.from(
                    form.querySelectorAll(
                      'input:not([disabled]):not([type="hidden"]), ' +
                      'textarea:not([disabled]), ' +
                      'button:not([disabled]), ' +
                      'select:not([disabled]), ' +
                      '[tabindex]:not([tabindex="-1"])'
                    )
                  );
                  
                  const currentIndex = focusableElements.indexOf(input);
                  
                  if (!e.shiftKey) {
                    // Tab forward
                    const nextElement = focusableElements[currentIndex + 1];
                    if (nextElement) {
                      nextElement.focus();
                      console.log("→ Moved to next field");
                    }
                  } else {
                    // Shift+Tab backward
                    const prevElement = focusableElements[currentIndex - 1];
                    if (prevElement) {
                      prevElement.focus();
                      console.log("← Moved to previous field");
                    }
                  }
                }
              }
            }, 100);
          }
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    console.log("✅ Listener attached for tab:", tabValue);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      console.log("🗑️ Listener removed for tab:", tabValue);
    };
  }, [tabValue]);
};

export const createFormAutoFocusRef = () => {
  return (formEl) => {
    if (!formEl) return;
    
    const scrollY = window.pageYOffset || window.scrollY;
    const scrollX = window.pageXOffset || window.scrollX;
    
    setTimeout(() => {
      // Try to find focusable elements in order of priority
      const firstInput = 
        // 1. MUI Autocomplete input
        formEl.querySelector('.MuiAutocomplete-input:not([disabled])') ||
        // 2. MUI DatePicker input (includes readonly)
        formEl.querySelector('input[type="text"]:not([disabled]):not([type="hidden"])') ||
        // 3. Regular inputs (excluding readonly)
        formEl.querySelector('input:not([disabled]):not([type="hidden"]):not([readonly])') ||
        // 4. Select dropdowns
        formEl.querySelector('select:not([disabled])') ||
        // 5. Textareas
        formEl.querySelector('textarea:not([disabled])') ||
        // 6. Any input with MuiInputBase class
        formEl.querySelector('.MuiInputBase-input:not([disabled])') ||
        // 7. Any button or focusable element
        formEl.querySelector('button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      
      if (firstInput && typeof firstInput.focus === "function") {
        // Focus without scrolling
        firstInput.focus({ preventScroll: true });
        
        // Restore scroll position
        window.scrollTo(scrollX, scrollY);
        
        // Double-check scroll position
        requestAnimationFrame(() => {
          window.scrollTo(scrollX, scrollY);
        });
        
        console.log("✅ Auto-focused on:", firstInput.type || firstInput.className || firstInput.tagName);
      } else {
        console.log("⚠️ No focusable element found");
      }
    }, 150);
  };
};

export const createFormAutoFocusRef_input = () => {
  return (formEl) => {
    if (!formEl) return;
    
    // Save current scroll position
    const scrollY = window.pageYOffset || window.scrollY;
    const scrollX = window.pageXOffset || window.scrollX;
    
    setTimeout(() => {
      // Get ALL potentially focusable elements
      const allInputs = formEl.querySelectorAll(
        'input:not([disabled]):not([type="hidden"]), ' +
        'select:not([disabled]), ' +
        'textarea:not([disabled]), ' +
        '[role="textbox"]:not([aria-disabled="true"])'
      );
      
      // Find the first visible one
      const firstInput = Array.from(allInputs).find(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               el.offsetParent !== null;
      });
      
      if (firstInput && typeof firstInput.focus === "function") {
        // Focus without scrolling
        firstInput.focus({ preventScroll: true });
        
        // Restore scroll position
        window.scrollTo(scrollX, scrollY);
        
        // Double-check scroll position
        requestAnimationFrame(() => {
          window.scrollTo(scrollX, scrollY);
        });
      }
    }, 150);
  };
};

export const createFormAutoFocusRefForStage = () => {
  return (formEl) => {
    if (!formEl) return;
    
    // Save current scroll position
    const scrollY = window.pageYOffset || window.scrollY;
    const scrollX = window.pageXOffset || window.scrollX;
    
    setTimeout(() => {
       const allInputs = formEl.querySelectorAll(
        'input:not([disabled]):not([type="hidden"]), ' +
        'select:not([disabled]), ' +
        'textarea:not([disabled]), ' +
        '[role="textbox"]:not([aria-disabled="true"])'
      );
      
      // Find the first visible one
      const firstInput = Array.from(allInputs).find(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               el.offsetParent !== null;
      });
      
      if (firstInput && typeof firstInput.focus === "function") {
        // Focus without scrolling
        firstInput.focus({ preventScroll: true });
        
        // Restore scroll position
        window.scrollTo(scrollX, scrollY);
        
        // Double-check scroll position
        requestAnimationFrame(() => {
          window.scrollTo(scrollX, scrollY);
        });
      }
    }, 150);
  };
};

export const KeyboardDebugger = () => {
  useEffect(() => {
    const handleAnyKey = (e) => {
      console.log("🔑 Global key:", e.key, "Target:", e.target.tagName, e.target);
    };
    
    document.addEventListener('keydown', handleAnyKey);
    return () => document.removeEventListener('keydown', handleAnyKey);
  }, []);
  
  return null;
};