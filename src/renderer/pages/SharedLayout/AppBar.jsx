function AppBarButton({ onClick, children }) {
  return (
    <button
      type="button"
      className="no-drag minimize block py-1.5 px-3 outline-none focus-within:ring-0 hover:cursor-pointer hover:bg-neutral-700 hover:fill-neutral-400 last:hover:bg-[#dc2626] last:hover:fill-[#fecaca] focus:ring-0"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default function AppBar() {
  return (
    <div>
      {/* invisible block to push elements */}
      <div className="drag invisible top-0 z-50 h-6 w-full"></div>

      <div className="drag fixed top-0 z-50 flex w-full items-center justify-between bg-neutral-900">
        <div className="brand select-none pl-2 text-neutral-400/95">
          Infinite Sketch
        </div>

        <div className="no-drag flex fill-neutral-500">
          <AppBarButton
            onClick={() => {
              window.api.minimize();
            }}
          >
            <svg className="block h-3 w-3" viewBox="0 0 448 512">
              {/* <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
              <path d="M400 288h-352c-17.69 0-32-14.32-32-32.01s14.31-31.99 32-31.99h352c17.69 0 32 14.3 32 31.99S417.7 288 400 288z" />
            </svg>
          </AppBarButton>

          <AppBarButton
            onClick={() => {
              window.api.maximize();
            }}
          >
            <svg className="h-3 w-3" viewBox="0 0 448 512">
              {/* <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
              <path d="M384 32C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H384zM384 80H64C55.16 80 48 87.16 48 96V416C48 424.8 55.16 432 64 432H384C392.8 432 400 424.8 400 416V96C400 87.16 392.8 80 384 80z" />
            </svg>
          </AppBarButton>

          <AppBarButton
            onClick={() => {
              window.api.close();
            }}
          >
            <svg className="h-3 w-3" viewBox="0 0 320 512">
              {/* <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
              <path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z" />
            </svg>
          </AppBarButton>
        </div>
      </div>
    </div>
  );
}
