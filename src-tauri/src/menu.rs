use crate::models::payloads::NavigatePayload;
use tauri::menu::{MenuBuilder, MenuItemBuilder, SubmenuBuilder};
use tauri::{AppHandle, Emitter, Manager};

pub fn setup_menu(handle: &AppHandle) {
  #[cfg(target_os = "macos")]
  {
    setup_macos(handle);
  }
  #[cfg(target_os = "windows")]
  {
    setup_windows(handle);
  }
  #[cfg(target_os = "linux")]
  {
    setup_linux(handle);
  }
}

#[allow(dead_code)]
fn setup_macos(handle: &AppHandle) {
  let is_pt = sys_locale::get_locale()
    .map(|l| l.to_lowercase().starts_with("pt"))
    .unwrap_or(false);

  let about_label = if is_pt { "Sobre o Rove" } else { "About Rove" };
  let settings_label = if is_pt {
    "Configurações…"
  } else {
    "Settings…"
  };
  let services_label = if is_pt { "Serviços" } else { "Services" };
  let hide_label = if is_pt { "Ocultar Rove" } else { "Hide Rove" };
  let hide_others_label = if is_pt {
    "Ocultar outros"
  } else {
    "Hide Others"
  };
  let quit_label = if is_pt { "Encerrar Rove" } else { "Quit Rove" };

  let edit_label = if is_pt { "Editar" } else { "Edit" };
  let undo_label = if is_pt { "Desfazer" } else { "Undo" };
  let redo_label = if is_pt { "Refazer" } else { "Redo" };
  let cut_label = if is_pt { "Recortar" } else { "Cut" };
  let copy_label = if is_pt { "Copiar" } else { "Copy" };
  let paste_label = if is_pt { "Colar" } else { "Paste" };
  let select_all_label = if is_pt {
    "Selecionar tudo"
  } else {
    "Select All"
  };

  let about_item = MenuItemBuilder::new(about_label)
    .id("about")
    .build(handle)
    .expect("Could not build about item.");

  let settings_item = MenuItemBuilder::new(settings_label)
    .id("settings")
    .accelerator("CmdOrCtrl+,")
    .build(handle)
    .expect("Could not build settings item.");

  let app_submenu = SubmenuBuilder::new(handle, "Rove")
    .item(&about_item)
    .separator()
    .item(&settings_item)
    .separator()
    .item(
      &tauri::menu::PredefinedMenuItem::services(handle, Some(services_label)).expect("services"),
    )
    .separator()
    .item(&tauri::menu::PredefinedMenuItem::hide(handle, Some(hide_label)).expect("hide"))
    .item(
      &tauri::menu::PredefinedMenuItem::hide_others(handle, Some(hide_others_label))
        .expect("hide others"),
    )
    .separator()
    .item(&tauri::menu::PredefinedMenuItem::quit(handle, Some(quit_label)).expect("quit"))
    .build()
    .expect("Could not build app submenu.");

  let edit_submenu = SubmenuBuilder::new(handle, edit_label)
    .item(&tauri::menu::PredefinedMenuItem::undo(handle, Some(undo_label)).expect("undo"))
    .item(&tauri::menu::PredefinedMenuItem::redo(handle, Some(redo_label)).expect("redo"))
    .separator()
    .item(&tauri::menu::PredefinedMenuItem::cut(handle, Some(cut_label)).expect("cut"))
    .item(&tauri::menu::PredefinedMenuItem::copy(handle, Some(copy_label)).expect("copy"))
    .item(&tauri::menu::PredefinedMenuItem::paste(handle, Some(paste_label)).expect("paste"))
    .item(
      &tauri::menu::PredefinedMenuItem::select_all(handle, Some(select_all_label))
        .expect("select all"),
    )
    .build()
    .expect("Could not build edit submenu.");

  let menu = MenuBuilder::new(handle)
    .items(&[&app_submenu, &edit_submenu])
    .build()
    .expect("Could not attach submenus to menu.");

  handle.set_menu(menu).expect("Could not attach menu.");
  handle.on_menu_event(move |app, event| {
    if event.id() == settings_item.id() {
      if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.set_focus();
      }
      let _ = app.emit(
        "navigate",
        NavigatePayload {
          route: "settings.downloads".into(),
        },
      );
    } else if event.id() == about_item.id() {
      if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.set_focus();
      }
      let _ = app.emit("open-about", ());
    }
  });
}

#[allow(dead_code)]
fn setup_windows(handle: &AppHandle) {
  let menu = MenuBuilder::new(handle)
    .items(&[])
    .build()
    .expect("Could not attach submenus to menu.");

  handle.set_menu(menu).expect("Could not attach menu.");
}

#[allow(dead_code)]
fn setup_linux(handle: &AppHandle) {
  let menu = MenuBuilder::new(handle)
    .items(&[])
    .build()
    .expect("Could not attach submenus to menu.");

  handle.set_menu(menu).expect("Could not attach menu.");
}
