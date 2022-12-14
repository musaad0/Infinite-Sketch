/* eslint-disable react/jsx-props-no-spreading */
import {
  ChangeEvent,
  Children,
  cloneElement,
  forwardRef,
  Fragment,
  isValidElement,
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { mergeRefs } from 'react-merge-refs';
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useRole,
  useDismiss,
  useFloating,
  FloatingFocusManager,
  useInteractions,
  useListNavigation,
  useTypeahead,
  FloatingOverlay,
} from '@floating-ui/react';
import { EContextMenuActions } from 'enums/menuActions';
import TransparentToMouseModal from './TransparentToMouseModal';
import RangeSlider from './RangeSlider';

export const MenuItem = forwardRef<
  HTMLButtonElement,
  {
    label: string;
    disabled?: boolean;
    shortcut: string;
    onClick: () => any;
    isChecked?: boolean;
  }
>(({ label, disabled, shortcut, onClick, isChecked, ...props }, ref) => {
  return (
    <button
      type="button"
      {...props}
      ref={ref}
      onClick={onClick}
      role="menuitem"
      disabled={disabled}
    >
      {isChecked && (
        <div className="absolute top-1/2 left-0 w-4 -translate-y-1/2 text-neutral-100">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            {/* <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
            <path d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
          </svg>
        </div>
      )}
      <div className="ml-6">{label}</div>
      <div>{shortcut}</div>
    </button>
  );
});

interface Props {
  label?: string;
  nested?: boolean;
}

export const Menu = forwardRef<any, Props & React.HTMLProps<HTMLButtonElement>>(
  ({ children }, ref) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [open, setOpen] = useState(false);

    const listItemsRef = useRef<Array<HTMLButtonElement | null>>([]);
    const listContentRef = useRef(
      Children.map(children, (child) =>
        isValidElement(child) ? child.props.label : null
      ) as Array<string | null>
    );

    const { x, y, reference, floating, strategy, refs, context } = useFloating({
      open,
      onOpenChange: setOpen,
      middleware: [offset({ mainAxis: 5, alignmentAxis: 4 }), flip(), shift()],
      placement: 'right-start',
      strategy: 'fixed',
      whileElementsMounted: autoUpdate,
    });

    const { getFloatingProps, getItemProps } = useInteractions([
      useRole(context, { role: 'menu' }),
      useDismiss(context),
      useListNavigation(context, {
        listRef: listItemsRef,
        activeIndex,
        onNavigate: setActiveIndex,
        focusItemOnOpen: false,
      }),
      useTypeahead(context, {
        enabled: open,
        listRef: listContentRef,
        onMatch: setActiveIndex,
        activeIndex,
      }),
    ]);

    const mergedReferenceRef = useMemo(
      () => mergeRefs([ref, reference]),
      [reference, ref]
    );

    useEffect(() => {
      function onContextMenu(e: MouseEvent) {
        e.preventDefault();
        mergedReferenceRef({
          getBoundingClientRect() {
            let { clientX } = e;
            const width = window.innerWidth;
            if (e.button === -1) {
              return {
                x: width / 2,
                y: window.innerHeight / 2,
                width: 0,
                height: 0,
                top: window.innerHeight / 2,
                right: 0,
                bottom: window.innerHeight / 2,
                left: 20,
              };
            }
            if (width <= 660 && !(clientX + 80 >= width || clientX - 80 <= 0)) {
              clientX = width / clientX;
            }

            return {
              x: clientX,
              y: e.clientY,
              width: 0,
              height: 0,
              top: e.clientY,
              right: clientX,
              bottom: e.clientY,
              left: clientX,
            };
          },
        });
        setOpen(true);
      }

      document.addEventListener('contextmenu', onContextMenu);
      return () => {
        document.removeEventListener('contextmenu', onContextMenu);
      };
    }, [mergedReferenceRef]);

    useLayoutEffect(() => {
      if (open) {
        refs.floating.current?.focus();
      }
    }, [open, refs.floating]);

    return (
      <FloatingPortal>
        {open && (
          <FloatingOverlay lockScroll>
            <FloatingFocusManager context={context} initialFocus={-1}>
              <div
                {...getFloatingProps({
                  className:
                    'bg-neutral-900 py-2.5 content-between flex flex-col px-6 outline-none rounded-md text-neutral-500 w-80 text-sm',
                  ref: floating,
                  style: {
                    position: strategy,
                    top: y ?? 0,
                    left: x ?? 0,
                  },
                })}
              >
                {Children.map(
                  children,
                  (child, index) =>
                    isValidElement(child) &&
                    cloneElement(
                      child,
                      getItemProps({
                        tabIndex: activeIndex === index ? 0 : -1,
                        onClick: () => {
                          if (child.props.onClick) {
                            child.props.onClick();
                            setOpen(false);
                          }
                        },
                        role: 'menuitem',
                        className:
                          'outline-none py-1.5 group hover:text-neutral-400 transition-colors flex relative fill-neutral-500 justify-between',
                        ref(node: HTMLButtonElement) {
                          listItemsRef.current[index] = node;
                        },
                      })
                    )
                )}
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    );
  }
);
const handleAlwaysOnTop = (checked: boolean) => {
  window.api.send('contextMenuActions', {
    action: EContextMenuActions.ALWAYS_ON_TOP,
    data: checked,
  });
};
const updateTransparentToMouse = (checked: boolean) => {
  window.api.send('contextMenuActions', {
    action: EContextMenuActions.TRANSPARENT_TO_MOUSE,
    data: checked,
  });
};

const updateWindowOpacity = (value: number | string) => {
  let val = value;
  if (typeof value === 'string') {
    val = parseInt(value, 10);
  }
  val /= 100;
  window.api.send('contextMenuActions', {
    action: EContextMenuActions.WINDOW_OPACITY,
    data: val,
  });
};

const handleShortcut = (
  e: KeyboardEvent,
  isCtrl: boolean,
  isShift: boolean,
  char: string
) => {
  const ctrlkey = isCtrl ? e.ctrlKey || e.metaKey : true;
  const shiftKey = isShift ? e.shiftKey : true;
  return ctrlkey && shiftKey && e.key.toLowerCase() === char;
};

export default function ContextMenu() {
  const [sessionData, setSessionData] = useState({
    [EContextMenuActions.ALWAYS_ON_TOP]: true,
    [EContextMenuActions.TRANSPARENT_TO_MOUSE]: false,
    [EContextMenuActions.WINDOW_OPACITY]: 100,
  });

  const [transparentToMouseModal, setTransparentToMouseModal] = useState(false);
  const { isMac } = window.api;
  const controlKey = isMac ? 'Cmd' : 'Ctrl';

  const updateBooleanState = (name: EContextMenuActions) => {
    setSessionData({
      ...sessionData,
      [name]: !sessionData[name],
    });
  };

  const handleTransparentToMouse = () => {
    if (sessionData.TRANSPARENT_TO_MOUSE) {
      updateTransparentToMouse(false);
      updateBooleanState(EContextMenuActions.TRANSPARENT_TO_MOUSE);
    } else {
      setTransparentToMouseModal(true);
    }
  };

  const handleWindowOpacity = (value: number) => {
    let result = sessionData.WINDOW_OPACITY + value;
    if (result > 100) result = 100;
    else if (result < 20) result = 20;
    updateWindowOpacity(result);
    setSessionData({
      ...sessionData,
      [EContextMenuActions.WINDOW_OPACITY]: result,
    });
  };

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (handleShortcut(e, true, true, 'a')) {
        handleAlwaysOnTop(!sessionData[EContextMenuActions.ALWAYS_ON_TOP]);
        updateBooleanState(EContextMenuActions.ALWAYS_ON_TOP);
      } else if (handleShortcut(e, true, true, 't')) {
        handleTransparentToMouse();
      } else if (handleShortcut(e, true, true, 'j')) {
        if (!(sessionData.WINDOW_OPACITY <= 20)) handleWindowOpacity(-10);
      } else if (handleShortcut(e, true, true, 'k')) {
        if (!(sessionData.WINDOW_OPACITY >= 100)) handleWindowOpacity(10);
      }
    },
    [sessionData]
  );

  const handleChange = (value: number | string) => {
    let val = value;
    if (typeof val === 'string') val = parseInt(value as string, 10);
    updateWindowOpacity(value);
    setSessionData({
      ...sessionData,
      [EContextMenuActions.WINDOW_OPACITY]: val,
    });
  };

  useEffect(() => {
    // attach the event listener
    document.addEventListener('keydown', handleKeyPress);

    // remove the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    const res = window.api.store.get('settings');
    if (res) {
      handleAlwaysOnTop(res.alwaysOnTop);
      setSessionData({
        ...sessionData,
        [EContextMenuActions.ALWAYS_ON_TOP]: res.alwaysOnTop,
      });
    } else {
      handleAlwaysOnTop(true);
    }
  }, []);

  return (
    <>
      <Menu>
        <MenuItem
          label="Always On Top"
          onClick={() => {
            handleAlwaysOnTop(!sessionData[EContextMenuActions.ALWAYS_ON_TOP]);
            updateBooleanState(EContextMenuActions.ALWAYS_ON_TOP);
          }}
          isChecked={sessionData[EContextMenuActions.ALWAYS_ON_TOP]}
          shortcut={`${controlKey}+Shift+A`}
        />
        <MenuItem
          label="Transparent To Mouse"
          onClick={() => handleTransparentToMouse()}
          shortcut={`${controlKey}+Shift+T`}
        />
        <MenuItem
          label="Opacity"
          onClick={() => {}}
          shortcut={`${controlKey}+Shift+(J or K)`}
        />
        <div className="ml-2">
          <RangeSlider
            max={100}
            min={20}
            step={5}
            initialValue={sessionData[EContextMenuActions.WINDOW_OPACITY]}
            onChange={handleChange}
            name="windowOpacity"
          />
        </div>
      </Menu>
      <TransparentToMouseModal
        isOpen={transparentToMouseModal}
        handleConfirm={() => {
          updateTransparentToMouse(true);
          updateBooleanState(EContextMenuActions.TRANSPARENT_TO_MOUSE);
          setTransparentToMouseModal(false);
        }}
        onClose={() => setTransparentToMouseModal(false)}
      />
    </>
  );
}
