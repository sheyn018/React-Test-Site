window.Libraria = {
  initializeOracle: async function (anonKey, userOptions) {
    const container = document.querySelector('#libraria-widget');
    const response = await fetch('https://api.libraria.ai/initialize-library', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ anonKey }),
    });
    const data = await response.json();
    const librarySlug = data.slug;

    if (librarySlug) {
      const isCompact = container.getAttribute('data-compact') === 'true';
      container.style.overflowY = 'hidden';

      window.addEventListener('message', function (event) {
        if (event.data.type === 'setHeight') {
          iframe.style.height = `${event.data.height}px`;
          container.style.height = `${event.data.height}px`; // Add this line

          iframe.contentWindow.postMessage({ type: 'userOptions', data: userOptions }, '*');

          if (libraryButton) {
            libraryButton.style.cursor = 'pointer';
            wrapperLibraryButton.style.display = 'block';

            // update iframe
            if (isOpen) {
              updateIFrame()
            }
          }
        }
      }, false);
      const iframe = document.createElement('iframe');
      iframe.width = '100%';
      iframe.style.overflowY = 'hidden';
      iframe.height = '100%';
      iframe.border = '0';
      iframe.position = 'absolute';
      iframe.top = 0;
      iframe.left = 0;
      iframe.title = 'Libraria Widget';
      iframe.style.border = 'none';


      if (container) {
        iframe.src = `https://${librarySlug}.libraria.ai/widget${isCompact ? '?compact=true' : ''}`;
        container.style.overflowY = 'hidden';
        container.appendChild(iframe);
      } else {
        console.error('Unable to find "Libraria" element to embed');
      }
    }
  },
  initializeSearch: async function (anonKey, userOptions) {
    // Create the iframe
    const openPopupButton = document.querySelector('#libraria-search');
    const response = await fetch('https://api.libraria.ai/initialize-library', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ anonKey }),
    });
    const data = await response.json();
    const librarySlug = data.slug;
    const iframe = document.createElement('iframe');
    iframe.src = `https://${librarySlug}.libraria.ai/search?compact=true&variant=search`;
    iframe.height = '100%';
    iframe.border = '0';
    iframe.position = 'absolute';
    iframe.title = 'Libraria Widget';
    iframe.style.border = 'none';
    iframe.style.display = 'none';
    iframe.style.position = 'fixed';
    iframe.style.top = '2.5%';
    iframe.style.left = '2.5%';
    iframe.style.width = '100%'
    iframe.style.background = 'none'
    iframe.style.maxHeight = 'calc(100% - 7.5rem)'; // Set the max height
    iframe.style.zIndex = '100';
    iframe.style.left = '0';
    iframe.style.right = '0';
    iframe.style.margin = 'auto';

    // Create a state object
    let state = {
      isOpen: false,
      isLoaded: false,
    };

    // Create the overlay
    const overlay = document.createElement('div');
    overlay.style.display = 'none';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.zIndex = '99';

    // Append the overlay and container to the body
    document.body.appendChild(overlay);
    document.body.appendChild(iframe);

    // keep track of escape key
    // escape overlay and popup on escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        toggleIsOpen();
        iframe.contentWindow.postMessage('toggle-widget-button', '*');
        window.focus(); // Add this line
      }
    });

    overlay.addEventListener('click', () => {
      toggleIsOpen();
      iframe.contentWindow.postMessage('toggle-widget-button', '*');
    });

    document.addEventListener('keydown', (event) => {
      if (event.metaKey && event.key === 'k') {
        iframe.contentWindow.postMessage('toggle-widget-button', '*');
        toggleIsOpen();
      }
    });

    openPopupButton.addEventListener('click', () => {
      toggleIsOpen();
      iframe.contentWindow.postMessage('toggle-widget-button', '*');
    });


    // Function to toggle isOpen state
    const toggleIsOpen = () => {
      state.isOpen = !state.isOpen;
      // update iframe
      if (state.isOpen) {
        iframe.style.display = 'block';
        overlay.style.display = 'block';
        if (!state.isLoaded) {
          iframe.style.background = 'white';
          iframe.style.width = window.innerWidth <= 768 ? '100%' : '40%';
          iframe.style.height = '20%';
          iframe.style.borderRadius = '12px'
        } else {
          iframe.style.background = 'none'
          iframe.style.width = '100%';
          iframe.style.height = '100%';
        }
      } else {
        iframe.style.display = 'none';
        iframe.style.background = 'none'
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        overlay.style.display = 'none';
      }
    };

    window.addEventListener('message', function (event) {
      if (event.data.type === 'setHeight') {
        iframe.style.height = `${event.data.height}px`;
        iframe.contentWindow.postMessage({ type: 'userOptions', data: userOptions }, '*');
        iframe.style.background = 'none'

        if (openPopupButton) {
          openPopupButton.style.cursor = 'pointer';
          wrapperLibraryButton.style.display = 'block';
        }
      } else if (event.data.type === 'setWidth') {
        iframe.style.width = `${event.data.width}px`
      } else if (event.data.type === 'toggle-widget') {
        toggleIsOpen();
        window.focus(); // Add this line
      } else if (event.data.type === 'widget-loaded' && !state.isLoaded) {
        state.isLoaded = true;
        if (state.isOpen) {
          iframe.contentWindow.postMessage('toggle-widget-button', '*');
        }
        iframe.style.width = '100%';
        iframe.style.height = '100%';
      }
    }, false);
  },
  initialize: async function (anonKey, userOptions) {
    const libraryButton = document.querySelector('#libraria-chatbot-button');
    const libraryElement = document.getElementById('libraria-chatbot');
    const response = await fetch('https://api.libraria.ai/initialize-library', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ anonKey }),
    });
    const data = await response.json();
    const librarySlug = data.slug;

    let parentLibraryButton = libraryButton && libraryButton.parentElement;
    let wrapperLibraryButton = document.createElement('div');
    let iframeRight = libraryButton?.style?.right?.toString()?.length > 0 ? libraryButton?.style?.right : libraryButton?.style?.left?.toString()?.length > 0 ? libraryButton?.style?.left : '20px';

    if (libraryButton) {
      parentLibraryButton.replaceChild(wrapperLibraryButton, libraryButton);
      wrapperLibraryButton.appendChild(libraryButton);
      wrapperLibraryButton.style.display = 'none';
      libraryButton.style.display = 'block';
    }
    let libraryLoaded = false;


    if (librarySlug) {
      const iframe = document.createElement('iframe');
      let buttonIframe;

      let buttonWidth = libraryButton ? 0 : '100';
      let buttonHeight = libraryButton ? "1 !important" : '75';

      iframe.src = `https://${librarySlug}.libraria.ai/chatbot`;
      iframe.width = "1";
      iframe.height = "1";

      iframe.style.border = 'none';

      iframe.style.position = 'fixed';
      iframe.style.bottom = '0';
      iframe.style.right = '0';
      iframe.style.zIndex = 2147483647;
      libraryElement.appendChild(iframe);


      window.addEventListener('resize', () => {
        if (isOpen) {
          setTimeout(() => {
            updateIFrame()
          }, 100);
        }
      });

      if (!libraryButton) {
        // wait for iframe loading then post message
        // add another iframe for button
        buttonIframe = document.createElement('iframe');
        buttonIframe.src = `https://${librarySlug}.libraria.ai/chatbot-button`;
        // get button width and height
        buttonIframe.width = 75;
        // align in center
        buttonIframe.height = 75;
        buttonIframe.style.border = 'none';
        buttonIframe.style.position = 'fixed';
        buttonIframe.style.bottom = '0px';
        buttonIframe.style.right = '20px';
        buttonIframe.style.zIndex = '2147483647';
        buttonIframe.style.display = 'none';
        libraryElement.appendChild(buttonIframe);
      }

      // get body inside iframe

      let isOpen = false;
      if (libraryButton) {
        // position bottom right library element  
        libraryButton.style.position = 'fixed';
        libraryButton.style.bottom = '20px';
        libraryButton.style.right = libraryButton?.style?.left?.toString()?.length > 0 ? undefined :
          libraryButton?.style?.right?.toString()?.length > 0 ? libraryButton?.style?.right : '20px';
        libraryButton.style.left = libraryButton?.style?.left?.toString()?.length > 0 ? libraryButton?.style?.left : undefined;

        libraryButton.style.zIndex = '2147483647';

        // handle hover
        libraryButton.addEventListener('mouseenter', () => {
          libraryButton.style.filter = 'brightness(0.8)';
        });
        libraryButton.addEventListener('mouseleave', () => {
          libraryButton.style.filter = 'brightness(1)';
        });

        // add on click to library element
        libraryButton.addEventListener('click', () => {
          iframe.contentWindow.postMessage('toggle-chat-button', '*');
          if (isOpen) {
            iframe.width = buttonWidth;
            iframe.height = buttonHeight;
            iframe.style.maxHeight = '0px';
            iframe.style.bottom = libraryButton ? `${libraryButton.clientHeight + 20 + (window.innerHeight - libraryButton.getBoundingClientRect().bottom)}px` : '100px';
            wrapperLibraryButton.style.display = 'block';
          } else {
            updateIFrame()
          }
          isOpen = !isOpen;
        });
      }


      // update iframe
      function updateIFrame() {
        let width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        let height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)


        if (width < 800 || height < 800) {
          iframe.style.transition = 'width 0.2s ease 0s, height 0.2s ease 0s';
          iframe.style.objectFit = 'fill';
          iframe.width = '100% !important';
          iframe.height = '100% !important';
          iframe.style.bottom = '0';
          iframe.style.right = '0';
          if (libraryButton?.style?.left?.toString()?.length > 0) {
            iframe.style.left = '0';
          }
          iframe.style.top = 'auto !important';
          iframe.style.overflow = 'hidden';
          iframe.style.userSelect = 'none';
          iframe.style.colorScheme = 'light';
          iframe.style.border = 'none';
          iframe.style.position = 'fixed';
          iframe.style.margin = '0px 0px 0px 0px';
          iframe.style.zIndex = 2147483002
          // force to take whole page
          iframe.style.height = '100%';
          iframe.style.maxHeight = '100%';


          // hide button
          if (libraryButton) {
            wrapperLibraryButton.style.display = 'none';
          } else {
            buttonIframe.style.display = 'none';
          }
        } else {
          iframe.style.margin = '0px 0px 0px 0px';
          iframe.style.overflowClipMargin = 'content-box !important'
          iframe.style.overflow = 'hidden';
          iframe.style.userSelect = 'none';
          iframe.style.colorScheme = 'light';
          iframe.style.overflow = 'hidden';
          iframe.style.border = 'none';
          iframe.style.borderRadius = '5px';
          iframe.style.position = 'fixed';
          // get height from bottom of window
          iframe.style.bottom = libraryButton ? `${libraryButton.clientHeight + 20 + (window.innerHeight - libraryButton.getBoundingClientRect().bottom)}px` : '75px'
          iframe.style.right = !libraryButton?.style?.left?.toString()?.length > 0 ? iframeRight : undefined;
          iframe.style.left = libraryButton?.style?.left?.toString()?.length > 0 ? libraryButton.style.left : undefined;
          iframe.style.display = 'block';
          iframe.style.height = 'calc(100% - 180px)';
          iframe.style.maxHeight = '705px';
          iframe.style.zIndex = 2147483002
          iframe.style.objectFit = 'fill';
          iframe.width = '414 !important';
          iframe.style.boxShadow = 'rgba(0, 0, 0, 0.16) 0px 5px 40px'
          if (libraryButton) {
            wrapperLibraryButton.style.display = 'block';
          } else {
            buttonIframe.style.display = 'block';
          }
        }
      }

      // listen for iframe ready
      window.addEventListener('message', (event) => {
        if (event.data === 'libraria-chat-widget-loaded') {
          iframe.contentWindow.postMessage({ type: 'userOptions', data: userOptions }, '*');

          if (libraryButton) {
            libraryButton.style.cursor = 'pointer';
            wrapperLibraryButton.style.display = 'block';

            // update iframe
            if (isOpen) {
              updateIFrame()
            }
          } else {
            if (!libraryLoaded) {
              buttonIframe.style.display = 'block';
              libraryLoaded = true;
            }
          }
        }

        if (event.data === 'toggle-chat') {
          if (isOpen) {
            iframe.width = buttonWidth;
            iframe.height = buttonHeight;
            iframe.style.maxHeight = '1px'
            if (libraryButton) {
              wrapperLibraryButton.style.display = 'block';
            } else {
              buttonIframe.style.display = 'block';
            }
          } else {
            // send to children
            updateIFrame()
          }
          iframe.contentWindow.postMessage('toggle-chat', '*');
          if (!libraryButton) {
            buttonIframe.contentWindow.postMessage('toggle-chat', '*');
          }
          isOpen = !isOpen;
        }

        if (event.data === 'toggle-chat-button') {
          if (isOpen) {
            iframe.width = buttonWidth;
            iframe.height = buttonHeight;
            iframe.style.maxHeight = '1px'
            if (libraryButton) {
              wrapperLibraryButton.style.display = 'block';
            } else {
              buttonIframe.style.display = 'block';
            }
          } else {
            // send to children
            updateIFrame()
          }
          iframe.contentWindow.postMessage('toggle-chat-button', '*');
          isOpen = !isOpen;
        }
      });

    } else {
      console.error('Error: data-librariaslug attribute not found');
    }
  },

  initializeCommerce: async function (anonKey, userOptions) {
    const libraryButton = document.querySelector('#chat-button');
    const libraryElement = document.getElementById('libraria-commerce');

    const response = await fetch('https://api.libraria.ai/initialize-library', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ anonKey }),
    });
    const data = await response.json();
    const librarySlug = data.slug;

    let parentLibraryButton = libraryButton && libraryButton.parentElement;
    let wrapperLibraryButton = document.createElement('div');
    
    // If the HTML file contains the chat-button element
    if (libraryButton) {
      parentLibraryButton.replaceChild(wrapperLibraryButton, libraryButton);
      wrapperLibraryButton.appendChild(libraryButton);
      wrapperLibraryButton.style.display = 'none';
      libraryButton.style.display = 'block';
    }

    let libraryLoaded = false;

    if (librarySlug) {
      const iframe = document.createElement('iframe');
      let buttonIframe;
      
      // If the libraryButton is not null
      let buttonWidth = libraryButton ? 0 : '100';
      let buttonHeight = libraryButton ? "1 !important" : '75';
      
      // Set the source URL of the iframe
      iframe.src = `https://${librarySlug}.libraria.ai/chatbot`;
      iframe.width = "1";
      iframe.height = "1";

      iframe.style.border = 'none';

      iframe.style.position = 'fixed';
      iframe.style.bottom = '0';
      iframe.style.right = '0';
      iframe.style.zIndex = 2147483647;
      
      // Create the overlay
      const overlay = document.createElement('div');
      overlay.style.display = 'none';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      overlay.style.zIndex = '99';
      
      // Add the overlay and iframe
      libraryElement.appendChild(overlay);
      libraryElement.appendChild(iframe);

      // Updates iframe when window is resized?
      window.addEventListener('resize', () => {
        if (isOpen) {
          setTimeout(() => {
            updateIFrame()
          }, 100);
        }
      });

      // Creates button if it does not exist
      if (!libraryButton) {
        // Add another iframe for button
        buttonIframe = document.createElement('iframe');
        buttonIframe.src = `https://${librarySlug}.libraria.ai/chatbot-button`;

        buttonIframe.width = 75;
        buttonIframe.height = 75;
        buttonIframe.style.border = 'none';
        buttonIframe.style.position = 'fixed';
        buttonIframe.style.bottom = '0px';
        buttonIframe.style.right = '20px';
        buttonIframe.style.zIndex = '2147483647';
        buttonIframe.style.display = 'none';
        libraryElement.appendChild(buttonIframe);
      }

      let isOpen = false;

      // Edits the libraryButton if it exists
      if (libraryButton) {
        // Hover effect of library button
        libraryButton.addEventListener('mouseenter', () => {
          libraryButton.style.filter = 'brightness(0.8)';
        });
        libraryButton.addEventListener('mouseleave', () => {
          libraryButton.style.filter = 'brightness(1)';
        });

        // When the chat button is clicked
        libraryButton.addEventListener('click', () => {
          iframe.contentWindow.postMessage('toggle-chat-button', '*');

          // If the chat modal is open
          if (isOpen) {
            iframe.width = buttonWidth;
            iframe.height = buttonHeight;
            iframe.style.maxHeight = '0px';
            iframe.style.bottom = libraryButton ? `${libraryButton.clientHeight + 20 + (window.innerHeight - libraryButton.getBoundingClientRect().bottom)}px` : '100px';
            wrapperLibraryButton.style.display = 'block';
          } 
          
          // If the chat modal is closed call the updateIFrame function to open it
          else {
            updateIFrame()
          }
          
          isOpen = !isOpen;
        });
      }

      // updateIFrame Function
      function updateIFrame() {
        overlay.style.display = 'block';
      
        const width = window.innerWidth || document.documentElement.clientWidth;
        const height = window.innerHeight || document.documentElement.clientHeight;
      
        if (width < 800 || height < 800) {
          const modalWidth = 414;
          const modalHeight = Math.min(705, height - 180);
      
          iframe.style.transition = 'width 0.2s ease 0s, height 0.2s ease 0s';
          iframe.style.objectFit = 'fill';
          iframe.width = `${modalWidth}px !important`;
          iframe.height = `${modalHeight}px !important`;
          iframe.style.left = '50%';
          iframe.style.top = '50%';
          iframe.style.transform = 'translate(-50%, -50%)';
          iframe.style.overflow = 'hidden';
          iframe.style.userSelect = 'none';
          iframe.style.colorScheme = 'light';
          iframe.style.border = 'none';
          iframe.style.position = 'fixed';
          iframe.style.margin = '0px 0px 0px 0px';
          iframe.style.zIndex = 2147483002;
      
          iframe.style.maxHeight = '100%';
      
          // hide button
          if (libraryButton) {
            wrapperLibraryButton.style.display = 'none';
          } 
          
          else {
            buttonIframe.style.display = 'none';
          }
        } 
        
        else {
          iframe.style.position = 'fixed';
          iframe.style.top = '50%';
          iframe.style.left = '50%';
          iframe.style.transform = 'translate(-50%, -50%)';
          iframe.style.width = '414px';
          iframe.style.height = 'calc(100% - 180px)';
          iframe.style.maxHeight = '705px';
          iframe.style.zIndex = 2147483002;
          iframe.style.objectFit = 'fill';
          iframe.style.boxShadow = 'rgba(0, 0, 0, 0.16) 0px 5px 40px';
      
          // Clear the previous positioning styles
          iframe.style.right = 'auto';
          iframe.style.bottom = 'auto';
      
          if (libraryButton) {
            wrapperLibraryButton.style.display = 'block';
          } 
          
          else {
            buttonIframe.style.display = 'block';
          }
        }
      }

      // When the user clicks on an area outside the modal, the modal closes
      overlay.addEventListener('click', () => {
        window.parent.postMessage('toggle-chat-button', '*');
      });

      // When user presses Escape, the modal closes
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          window.parent.postMessage('toggle-chat-button', '*');
        }
      });

      // For triggering events
      window.addEventListener('message', (event) => {
        if (event.data === 'libraria-chat-widget-loaded') {
          iframe.contentWindow.postMessage({ type: 'userOptions', data: userOptions }, '*');

          if (libraryButton) {
            libraryButton.style.cursor = 'pointer';
            wrapperLibraryButton.style.display = 'block';

            // If the chat modal is open
            if (isOpen) {
              updateIFrame()
            }
          }
          
          else {
            if (!libraryLoaded) {
              buttonIframe.style.display = 'block';
              libraryLoaded = true;
            }
          }
        }
        
        // This closes and opens the pop up
        if (event.data === 'toggle-chat') {
          // If the chat modal is open
          if (isOpen) {
            iframe.width = buttonWidth;
            iframe.height = buttonHeight;
            iframe.style.maxHeight = '1px'

            if (libraryButton) {
              wrapperLibraryButton.style.display = 'block';
            } 
            
            else {
              buttonIframe.style.display = 'block';
            }

            overlay.style.display = 'none';
          }
          
          // If the chat modal is closed
          else {
            updateIFrame()
          }

          iframe.contentWindow.postMessage('toggle-chat', '*');

          if (!libraryButton) {
            buttonIframe.contentWindow.postMessage('toggle-chat', '*');
          }

          isOpen = !isOpen;
        }

        if (event.data === 'toggle-chat-button') {
          iframe.contentWindow.postMessage('toggle-chat', '*');
        
          if (isOpen) {
            iframe.width = buttonWidth;
            iframe.height = buttonHeight;
            iframe.style.maxHeight = '1px'

            if (libraryButton) {
              wrapperLibraryButton.style.display = 'block';
            } 
            
            else {
              buttonIframe.style.display = 'block';
            }

            overlay.style.display = 'none';
          } 
          
          else {
            updateIFrame()
          }

          iframe.contentWindow.postMessage('toggle-chat-button', '*');
          isOpen = !isOpen;
        }
      }
    );
  }
}
}
