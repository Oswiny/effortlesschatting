export let defaultConfig = {
    useStartAsDefaultOffset: false,
    get defaultOffsetPosition() { return defaultConfig.useStartAsDefaultOffset ? "start" : "end" },
    autoSpace: true,
    allowText: true,
    deleteAfterMs: 10000,
    contentNodeAmount: 5,
    bannedWords: new Set(["\n", "", "͏", "​", "‌", "‍", "﻿", "͏", "⁠", "⁣", "⁢", "⁤", "", "", "", "", "", "", "", "", "", "", ""]),
    bannedEmotes: new Set([]),
    bannedUsers: new Set([]),
    scrapeBots: false,
    scrapeMods: false,
    scrapeVIPs: true,
    scrapeOnlySubs: false,
    scrapeSubsWithMinimumMonths: 12,
    updateNodesAfterTimeout: false,
    autoHide: false,
    scrapeAlreadySentMessages: true,
    requiredHoldTime: 5000,
    messageClickAnimationTime: 125,
    scannerMethod: "injection-with-emotes",
    language: "en",
    allowSelf: true,
    seventvInstallationWaitTime: 2000,
}

export const labels = {
    en: {
        scannerMethod: {
            main: "Scanner Method",
            alt: "Choose the method for detecting incoming messages"
        },
        allowSelf: {
            main: "Allow Self Scan",
            alt: "Allow the scanner to detect your own messages"
        },
        addButton: {
            main: "Add"
        },
        resetButton: {
            main: "Reset All"
        },
        setMessageBox: {
            main: "Message Box Settings",
            alt: "Customize message box behavior",
        },
        setInsert: {
            main: "Insert Settings",
            alt: "Adjust insertion behavior",
        },
        mainTag: {
            main: "Effortless Chatting",
            alt: "Settings",
        },
        setScanner: {
            main: "Scanner Settings",
            alt: "Adjust scanner behavior",
        },
        useStartAsDefaultOffset: {
            main: "Default Insert Position",
            alt: "Insert at the start or end if no cursor is active",
        },
        autoSpace: {
            main: "Automatic Spacing",
            alt: "Automatically add spaces when inserting a message",
        },
        allowText: {
            main: "Allow Text",
            alt: "Allow scanning of text messages",
        },
        deleteAfterMs: {
            main: "Message Lifespan",
            alt: "Duration a scanned message remains visible",
        },
        contentNodeAmount: {
            main: "Number of Message Boxes",
            alt: "Count of message boxes displayed",
        },
        bannedWords: {
            main: "Blocked Words",
            alt: "These words will be ignored by the scanner",
        },
        bannedEmotes: {
            main: "Blocked Emotes",
            alt: "These emotes will be ignored by the scanner",
        },
        bannedUsers: {
            main: "Blocked Users",
            alt: "These users' messages will be ignored by the scanner",
        },
        scrapeBots: {
            main: "Allow Bots",
            alt: "Allow scanning messages from bots",
        },
        scrapeMods: {
            main: "Allow Mods",
            alt: "Allow scanning messages from moderators",
        },
        scrapeVIPs: {
            main: "Allow VIPs",
            alt: "Allow scanning messages from VIPs",
        },
        scrapeOnlySubs: {
            main: "Allow Only Subscribers",
            alt: "Only scan messages from subscribed users",
        },
        scrapeSubsWithMinimumMonths: {
            main: "Minimum Subscription Duration",
            alt: "Only scan users subscribed for at least the selected number of months",
        },
        updateNodesAfterTimeout: {
            main: "Refresh After Expiration",
            alt: "Refresh message boxes after the message lifespan ends",
        },
        autoHide: {
            main: "Auto-Hide",
            alt: "Automatically hide the panel when no messages are available",
        },
        scrapeAlreadySentMessages: {
            main: "Scan Chat History",
            alt: "Scan messages already visible in chat",
        },
        requiredHoldTime: {
            main: "Long-Press to Send",
            alt: "Duration to hold the message box to auto-send",
        },
        messageClickAnimationTime: {
            main: "Click Animation Duration",
            alt: "Length of the animation when a message box is clicked",
        },
        other: {
            main: "Other",
            alt: "Other settings",
        },
        language: {
            main: "Language",
            alt: "Select interface language",
        },
        noMessages: {
            main: "No Messages Found"
        },
        month: {
            main: "Month"
        },
        remove: {
            main: "Remove"
        },
        enterItem: {
            main: "Enter item..."
        },
        milliseconds: {
            main: "Milliseconds"
        },
        legacy: {
            main: "Legacy",
        },
        "injection-without-emotes": {
            main: "Injection Based (Without Emotes)",
        },
        "injection-with-emotes": {
            main: "Injection Based (With Emotes)",
        },
        seventvInstallationWaitTime: {
            main: "7TV Detection Timeout",
            alt: "Time to wait for 7TV to load. Increase this if you see '7TV installation not detected'."
        },
        "seventv-alert": {
            main: "Note: 7TV must be installed for this feature to work!"
        },
        "seventv-not-detected": {
            main: "7TV installation not detected"
        }
    },

    es: {
        scannerMethod: {
            main: "Método de Escaneo",
            alt: "Elige el método para detectar mensajes entrantes"
        },
        allowSelf: {
            main: "Permitir autoescaneo",
            alt: "Permitir que el escáner detecte tus propios mensajes"
        },
        addButton: {
            main: "Agregar"
        },
        resetButton: {
            main: "Restablecer Todo"
        },
        setMessageBox: {
            main: "Configuración de Cajas de Mensajes",
            alt: "Personaliza el comportamiento de las cajas de mensajes",
        },
        setInsert: {
            main: "Configuración de Inserción",
            alt: "Ajusta el comportamiento de inserción",
        },
        mainTag: {
            main: "Effortless Chatting",
            alt: "Configuración",
        },
        setScanner: {
            main: "Configuración del Escáner",
            alt: "Ajusta el comportamiento del escáner",
        },
        useStartAsDefaultOffset: {
            main: "Posición de Inserción Predeterminada",
            alt: "Inserta al inicio o al final si no hay cursor activo",
        },
        autoSpace: {
            main: "Espaciado Automático",
            alt: "Agrega espacios automáticamente al insertar un mensaje",
        },
        allowText: {
            main: "Permitir Texto",
            alt: "Permite escanear mensajes de texto",
        },
        deleteAfterMs: {
            main: "Duración del Mensaje",
            alt: "Tiempo que un mensaje escaneado permanece visible",
        },
        contentNodeAmount: {
            main: "Número de Cajas de Mensajes",
            alt: "Cantidad de cajas de mensajes mostradas",
        },
        bannedWords: {
            main: "Palabras Bloqueadas",
            alt: "Estas palabras serán ignoradas por el escáner",
        },
        bannedEmotes: {
            main: "Emotes Bloqueados",
            alt: "Estos emotes serán ignorados por el escáner",
        },
        bannedUsers: {
            main: "Usuarios Bloqueados",
            alt: "Los mensajes de estos usuarios serán ignorados",
        },
        scrapeBots: {
            main: "Permitir Bots",
            alt: "Permite escanear mensajes de bots",
        },
        scrapeMods: {
            main: "Permitir Moderadores",
            alt: "Permite escanear mensajes de moderadores",
        },
        scrapeVIPs: {
            main: "Permitir VIPs",
            alt: "Permite escanear mensajes de usuarios VIP",
        },
        scrapeOnlySubs: {
            main: "Permitir Solo Suscriptores",
            alt: "Escanea solo mensajes de usuarios suscritos",
        },
        scrapeSubsWithMinimumMonths: {
            main: "Meses Mínimos de Suscripción",
            alt: "Escanea solo usuarios suscritos durante al menos el número de meses seleccionado",
        },
        updateNodesAfterTimeout: {
            main: "Actualizar al Expirar",
            alt: "Actualiza las cajas de mensajes cuando finaliza la duración del mensaje",
        },
        autoHide: {
            main: "Ocultar Automáticamente",
            alt: "Oculta el panel automáticamente cuando no hay mensajes",
        },
        scrapeAlreadySentMessages: {
            main: "Escanear Historial",
            alt: "Escanea mensajes ya visibles en el chat",
        },
        requiredHoldTime: {
            main: "Mantener pulsado para enviar",
            alt: "Tiempo que debes mantener pulsado para el envío automático",
        },
        messageClickAnimationTime: {
            main: "Duración Animación Clic",
            alt: "Duración de la animación al hacer clic en una caja",
        },
        other: {
            main: "Otros",
            alt: "Otras configuraciones",
        },
        language: {
            main: "Idioma",
            alt: "Seleccionar idioma de la interfaz",
        },
        noMessages: {
            main: "No se encontraron mensajes"
        },
        month: {
            main: "Mes"
        },
        remove: {
            main: "Eliminar"
        },
        enterItem: {
            main: "Ingresar artículo..."
        },
        milliseconds: {
            main: "Milisegundos"
        },
        legacy: {
            main: "Legado (Legacy)",
        },
        "injection-without-emotes": {
            main: "Basado en inyección (sin emotes)",
        },
        "injection-with-emotes": {
            main: "Basado en inyección (con emotes)",
        },
        seventvInstallationWaitTime: {
            main: "Tiempo de espera detección 7TV",
            alt: "Tiempo de espera para cargar 7TV. Aumenta esto si ves el mensaje 'Instalación de 7TV no detectada'."
        },
        "seventv-alert": {
            main: "Nota: ¡7TV debe estar instalado para que esto funcione!"
        },
        "seventv-not-detected": {
            main: "Instalación de 7TV no detectada"
        }
    },

    ja: {
        scannerMethod: {
            main: "スキャナー方式",
            alt: "メッセージを検出・スキャンする方法を選択します"
        },
        allowSelf: {
            main: "セルフスキャンを許可",
            alt: "スキャナーが自身のメッセージを検出することを許可します"
        },
        addButton: {
            main: "追加"
        },
        resetButton: {
            main: "すべてリセット"
        },
        setMessageBox: {
            main: "メッセージボックス設定",
            alt: "メッセージボックスの動作をカスタマイズします",
        },
        setInsert: {
            main: "挿入設定",
            alt: "挿入動作を調整します",
        },
        mainTag: {
            main: "Effortless Chatting",
            alt: "設定",
        },
        setScanner: {
            main: "スキャナー設定",
            alt: "スキャナーの動作を調整します",
        },
        useStartAsDefaultOffset: {
            main: "デフォルトの挿入位置",
            alt: "カーソルがない場合、メッセージを先頭または末尾に挿入します",
        },
        autoSpace: {
            main: "自動スペース",
            alt: "メッセージ挿入時に自動でスペースを追加します",
        },
        allowText: {
            main: "テキストを許可",
            alt: "テキストメッセージのスキャンを許可します",
        },
        deleteAfterMs: {
            main: "メッセージ表示時間",
            alt: "スキャンされたメッセージが表示され続ける時間",
        },
        contentNodeAmount: {
            main: "メッセージボックス数",
            alt: "表示されるメッセージボックスの数",
        },
        bannedWords: {
            main: "ブロックされた単語",
            alt: "これらの単語はスキャナーにより無視されます",
        },
        bannedEmotes: {
            main: "ブロックされたエモート",
            alt: "これらのエモートはスキャナーにより無視されます",
        },
        bannedUsers: {
            main: "ブロックされたユーザー",
            alt: "これらのユーザーからのメッセージは無視されます",
        },
        scrapeBots: {
            main: "ボットを許可",
            alt: "ボットからのメッセージをスキャンします",
        },
        scrapeMods: {
            main: "モデレーターを許可",
            alt: "モデレーターからのメッセージをスキャンします",
        },
        scrapeVIPs: {
            main: "VIPを許可",
            alt: "VIPユーザーからのメッセージをスキャンします",
        },
        scrapeOnlySubs: {
            main: "サブスクライバーのみ許可",
            alt: "サブスクライバーからのメッセージのみをスキャンします",
        },
        scrapeSubsWithMinimumMonths: {
            main: "最低サブスク期間（月）",
            alt: "指定した月数以上サブスクしているユーザーのみをスキャンします",
        },
        updateNodesAfterTimeout: {
            main: "表示終了後に更新",
            alt: "メッセージの表示時間終了後にボックスを更新します",
        },
        autoHide: {
            main: "自動非表示",
            alt: "メッセージがない場合、パネルを自動で非表示にします",
        },
        scrapeAlreadySentMessages: {
            main: "履歴をスキャン",
            alt: "すでにチャットに表示されているメッセージをスキャンします",
        },
        requiredHoldTime: {
            main: "長押しで送信",
            alt: "自動送信するためにメッセージボックスを長押しする時間",
        },
        messageClickAnimationTime: {
            main: "クリック時のアニメーション時間",
            alt: "メッセージボックスをクリックした際のアニメーション時間",
        },
        other: {
            main: "その他",
            alt: "その他の設定",
        },
        language: {
            main: "言語",
            alt: "インターフェース言語を選択",
        },
        noMessages: {
            main: "メッセージが見つかりませんでした"
        },
        month: {
            main: "ヶ月"
        },
        remove: {
            main: "削除"
        },
        enterItem: {
            main: "アイテムを入力..."
        },
        milliseconds: {
            main: "ミリ秒"
        },
        legacy: {
            main: "レガシー (Legacy)",
        },
        "injection-without-emotes": {
            main: "インジェクション方式 (絵文字なし)",
        },
        "injection-with-emotes": {
            main: "インジェクション方式 (絵文字あり)",
        },
        seventvInstallationWaitTime: {
            main: "7TV 検出待機時間",
            alt: "7TVの読み込みを待機する時間です。「7TVのインストールが検出されませんでした」と表示される場合は、この値を増やしてください。"
        },
        "seventv-alert": {
            main: "注意: この機能を使用するには7TVがインストールされている必要があります！"
        },
        "seventv-not-detected": {
            main: "7TVのインストールが検出されませんでした"
        }
    },

    de: {
        scannerMethod: {
            main: "Scan-Methode",
            alt: "Wähle die Methode zur Erkennung eingehender Nachrichten"
        },
        allowSelf: {
            main: "Selbst-Scan erlauben",
            alt: "Erlaubt dem Scanner, deine eigenen Nachrichten zu erkennen"
        },
        addButton: {
            main: "Hinzufügen"
        },
        resetButton: {
            main: "Alles Zurücksetzen"
        },
        setMessageBox: {
            main: "Nachrichtenbox-Einstellungen",
            alt: "Verhalten der Nachrichtenboxen anpassen",
        },
        setInsert: {
            main: "Einfüge-Einstellungen",
            alt: "Einfügeverhalten anpassen",
        },
        mainTag: {
            main: "Effortless Chatting",
            alt: "Einstellungen",
        },
        setScanner: {
            main: "Scanner-Einstellungen",
            alt: "Scanner-Verhalten anpassen",
        },
        useStartAsDefaultOffset: {
            main: "Standard-Einfügeposition",
            alt: "Fügt am Anfang oder Ende ein, wenn kein Cursor aktiv ist",
        },
        autoSpace: {
            main: "Automatischer Abstand",
            alt: "Fügt beim Einfügen automatisch Leerzeichen hinzu",
        },
        allowText: {
            main: "Text Erlauben",
            alt: "Erlaubt das Scannen von Textnachrichten",
        },
        deleteAfterMs: {
            main: "Nachrichtenlebensdauer",
            alt: "Dauer, die eine gescannte Nachricht sichtbar bleibt",
        },
        contentNodeAmount: {
            main: "Anzahl der Nachrichtenboxen",
            alt: "Anzahl der angezeigten Nachrichtenboxen",
        },
        bannedWords: {
            main: "Blockierte Wörter",
            alt: "Diese Wörter werden vom Scanner ignoriert",
        },
        bannedEmotes: {
            main: "Blockierte Emotes",
            alt: "Diese Emotes werden vom Scanner ignoriert",
        },
        bannedUsers: {
            main: "Blockierte Benutzer",
            alt: "Nachrichten dieser Benutzer werden ignoriert",
        },
        scrapeBots: {
            main: "Bots Erlauben",
            alt: "Erlaubt das Scannen von Bot-Nachrichten",
        },
        scrapeMods: {
            main: "Moderatoren Erlauben",
            alt: "Erlaubt das Scannen von Moderator-Nachrichten",
        },
        scrapeVIPs: {
            main: "VIPs Erlauben",
            alt: "Erlaubt das Scannen von VIP-Nachrichten",
        },
        scrapeOnlySubs: {
            main: "Nur Abonnenten Erlauben",
            alt: "Scannt nur Nachrichten von abonnierten Benutzern",
        },
        scrapeSubsWithMinimumMonths: {
            main: "Minimale Abodauer",
            alt: "Scannt nur Benutzer, die mindestens die gewählte Anzahl an Monaten abonniert sind",
        },
        updateNodesAfterTimeout: {
            main: "Aktualisieren nach Ablauf",
            alt: "Aktualisiert Boxen nach Ablauf der Nachrichtenlebensdauer",
        },
        autoHide: {
            main: "Automatisch Ausblenden",
            alt: "Blendet das Panel automatisch aus, wenn keine Nachrichten da sind",
        },
        scrapeAlreadySentMessages: {
            main: "Chat-Verlauf Scannen",
            alt: "Scannt Nachrichten, die bereits im Chat sichtbar sind",
        },
        requiredHoldTime: {
            main: "Lange Drücken zum Senden",
            alt: "Dauer, die gedrückt werden muss, um automatisch zu senden",
        },
        messageClickAnimationTime: {
            main: "Klick-Animationsdauer",
            alt: "Dauer der Animation beim Klicken auf eine Box",
        },
        other: {
            main: "Sonstiges",
            alt: "Weitere Einstellungen",
        },
        language: {
            main: "Sprache",
            alt: "Sprache der Benutzeroberfläche wählen",
        },
        noMessages: {
            main: "Keine Nachrichten gefunden"
        },
        month: {
            main: "Monat"
        },
        remove: {
            main: "Entfernen"
        },
        enterItem: {
            main: "Element eingeben..."
        },
        milliseconds: {
            main: "Millisekunden"
        },
        legacy: {
            main: "Legacy (Veraltet)",
        },
        "injection-without-emotes": {
            main: "Injektionsbasiert (Ohne Emotes)",
        },
        "injection-with-emotes": {
            main: "Injektionsbasiert (Mit Emotes)",
        },
        seventvInstallationWaitTime: {
            main: "7TV-Erkennungszeit",
            alt: "Wartezeit für das Laden von 7TV. Erhöhen Sie dies, wenn '7TV-Installation nicht erkannt' angezeigt wird."
        },
        "seventv-alert": {
            main: "Hinweis: 7TV muss installiert sein, damit dies funktioniert!"
        },
        "seventv-not-detected": {
            main: "7TV-Installation nicht erkannt"
        }
    },

    fr: {
        scannerMethod: {
            main: "Méthode de Scan",
            alt: "Choisissez la méthode pour détecter les messages entrants"
        },
        allowSelf: {
            main: "Autoriser l'auto-scan",
            alt: "Autoriser le scanner à détecter vos propres messages"
        },
        addButton: {
            main: "Ajouter"
        },
        resetButton: {
            main: "Tout Réinitialiser"
        },
        setMessageBox: {
            main: "Réglages des Messages",
            alt: "Personnalisez le comportement des boîtes de messages",
        },
        setInsert: {
            main: "Réglages d’Insertion",
            alt: "Ajustez le comportement d’insertion",
        },
        mainTag: {
            main: "Effortless Chatting",
            alt: "Paramètres",
        },
        setScanner: {
            main: "Réglages du Scanner",
            alt: "Ajustez le comportement du scanner",
        },
        useStartAsDefaultOffset: {
            main: "Position d’Insertion par Défaut",
            alt: "Insère au début ou à la fin si aucun curseur n’est actif",
        },
        autoSpace: {
            main: "Espacement Automatique",
            alt: "Ajoute automatiquement des espaces lors de l’insertion",
        },
        allowText: {
            main: "Autoriser le Texte",
            alt: "Autorise le scan des messages texte",
        },
        deleteAfterMs: {
            main: "Durée de Vie du Message",
            alt: "Durée pendant laquelle un message scanné reste visible",
        },
        contentNodeAmount: {
            main: "Nombre de Boîtes de Messages",
            alt: "Nombre de boîtes de messages affichées",
        },
        bannedWords: {
            main: "Mots Bloqués",
            alt: "Ces mots seront ignorés par le scanner",
        },
        bannedEmotes: {
            main: "Emotes Bloquées",
            alt: "Ces emotes seront ignorées par le scanner",
        },
        bannedUsers: {
            main: "Utilisateurs Bloqués",
            alt: "Les messages de ces utilisateurs seront ignorés",
        },
        scrapeBots: {
            main: "Autoriser les Bots",
            alt: "Autorise le scan des messages des bots",
        },
        scrapeMods: {
            main: "Autoriser les Modérateurs",
            alt: "Autorise le scan des messages des modérateurs",
        },
        scrapeVIPs: {
            main: "Autoriser les VIPs",
            alt: "Autorise le scan des messages des VIPs",
        },
        scrapeOnlySubs: {
            main: "Autoriser Uniquement les Abonnés",
            alt: "Scanne uniquement les messages des utilisateurs abonnés",
        },
        scrapeSubsWithMinimumMonths: {
            main: "Durée Min. d’Abonnement",
            alt: "Scanne uniquement les utilisateurs abonnés depuis au moins le nombre de mois choisi",
        },
        updateNodesAfterTimeout: {
            main: "Actualiser Après Expiration",
            alt: "Actualise les boîtes après la fin de la durée de vie du message",
        },
        autoHide: {
            main: "Masquage Automatique",
            alt: "Masque automatiquement le panneau s'il n'y a pas de messages",
        },
        scrapeAlreadySentMessages: {
            main: "Scanner l'Historique",
            alt: "Scanne les messages déjà visibles dans le chat",
        },
        requiredHoldTime: {
            main: "Appui Long pour Envoyer",
            alt: "Durée de l'appui nécessaire pour l'envoi automatique",
        },
        messageClickAnimationTime: {
            main: "Durée Animation au Clic",
            alt: "Durée de l’animation lors du clic sur une boîte",
        },
        other: {
            main: "Autres",
            alt: "Autres paramètres",
        },
        language: {
            main: "Langue",
            alt: "Choisir la langue de l'interface",
        },
        noMessages: {
            main: "Aucun message trouvé"
        },
        month: {
            main: "Mois"
        },
        remove: {
            main: "Supprimer"
        },
        enterItem: {
            main: "Saisir l'article..."
        },
        milliseconds: {
            main: "Millisecondes"
        },
        legacy: {
            main: "Hérité (Legacy)",
        },
        "injection-without-emotes": {
            main: "Basé sur l'injection (sans emotes)",
        },
        "injection-with-emotes": {
            main: "Basé sur l'injection (avec emotes)",
        },
        seventvInstallationWaitTime: {
            main: "Délai détection 7TV",
            alt: "Temps d'attente pour 7TV. Augmentez ceci si vous voyez 'Installation de 7TV non détectée'."
        },
        "seventv-alert": {
            main: "Note : 7TV doit être installé pour que cela fonctionne !"
        },
        "seventv-not-detected": {
            main: "Installation de 7TV non détectée"
        }
    },

    ko: {
        scannerMethod: {
            main: "스캐너 방식",
            alt: "들어오는 메시지를 감지하는 방식을 선택합니다"
        },
        allowSelf: {
            main: "셀프 스캔 허용",
            alt: "스캐너가 본인의 메시지를 감지하도록 허용합니다"
        },
        addButton: {
            main: "추가"
        },
        resetButton: {
            main: "모두 초기화"
        },
        setMessageBox: {
            main: "메시지 박스 설정",
            alt: "메시지 박스의 동작을 사용자 정의합니다",
        },
        setInsert: {
            main: "삽입 설정",
            alt: "삽입 동작을 조정합니다",
        },
        mainTag: {
            main: "Effortless Chatting",
            alt: "설정",
        },
        setScanner: {
            main: "스캐너 설정",
            alt: "스캐너의 동작을 조정합니다",
        },
        useStartAsDefaultOffset: {
            main: "기본 삽입 위치",
            alt: "커서가 없을 경우 메시지를 시작 또는 끝에 삽입합니다",
        },
        autoSpace: {
            main: "자동 공백",
            alt: "메시지를 삽입할 때 자동으로 공백을 추가합니다",
        },
        allowText: {
            main: "텍스트 허용",
            alt: "텍스트 메시지 스캔을 허용합니다",
        },
        deleteAfterMs: {
            main: "메시지 표시 시간",
            alt: "스캔된 메시지가 화면에 유지되는 시간",
        },
        contentNodeAmount: {
            main: "메시지 박스 수",
            alt: "표시할 메시지 박스의 개수",
        },
        bannedWords: {
            main: "차단된 단어",
            alt: "이 단어들은 스캐너에서 무시됩니다",
        },
        bannedEmotes: {
            main: "차단된 이모트",
            alt: "이 이모트들은 스캐너에서 무시됩니다",
        },
        bannedUsers: {
            main: "차단된 사용자",
            alt: "이 사용자들의 메시지는 무시됩니다",
        },
        scrapeBots: {
            main: "봇 허용",
            alt: "봇의 메시지 스캔을 허용합니다",
        },
        scrapeMods: {
            main: "매니저 허용",
            alt: "매니저의 메시지 스캔을 허용합니다",
        },
        scrapeVIPs: {
            main: "VIP 허용",
            alt: "VIP 사용자의 메시지 스캔을 허용합니다",
        },
        scrapeOnlySubs: {
            main: "구독자만 허용",
            alt: "구독한 사용자의 메시지만 스캔합니다",
        },
        scrapeSubsWithMinimumMonths: {
            main: "최소 구독 기간",
            alt: "선택한 개월 수 이상 구독한 사용자만 스캔합니다",
        },
        updateNodesAfterTimeout: {
            main: "만료 후 새로고침",
            alt: "메시지 유지 시간이 끝난 후 박스를 새로고침합니다",
        },
        autoHide: {
            main: "자동 숨김",
            alt: "표시할 메시지가 없으면 패널을 자동으로 숨깁니다",
        },
        scrapeAlreadySentMessages: {
            main: "채팅 기록 스캔",
            alt: "채팅창에 이미 보이는 메시지를 스캔합니다",
        },
        requiredHoldTime: {
            main: "길게 눌러 전송",
            alt: "자동 전송을 위해 박스를 길게 누르는 시간",
        },
        messageClickAnimationTime: {
            main: "클릭 애니메이션 시간",
            alt: "메시지 박스를 클릭했을 때의 애니메이션 재생 시간",
        },
        other: {
            main: "기타",
            alt: "기타 설정",
        },
        language: {
            main: "언어",
            alt: "인터페이스 언어 선택",
        },
        noMessages: {
            main: "메시지를 찾을 수 없습니다"
        },
        month: {
            main: "개월"
        },
        remove: {
            main: "삭제"
        },
        enterItem: {
            main: "항목 입력..."
        },
        milliseconds: {
            main: "밀리초"
        },
        legacy: {
            main: "레거시 (Legacy)",
        },
        "injection-without-emotes": {
            main: "인젝션 방식 (이모티콘 제외)",
        },
        "injection-with-emotes": {
            main: "인젝션 방식 (이모티콘 포함)",
        },
        seventvInstallationWaitTime: {
            main: "7TV 감지 대기 시간",
            alt: "7TV 로딩을 기다리는 시간입니다. '7TV 설치가 감지되지 않음'이 표시되면 이 값을 늘리세요."
        },
        "seventv-alert": {
            main: "참고: 이 기능이 작동하려면 7TV가 설치되어 있어야 합니다!"
        },
        "seventv-not-detected": {
            main: "7TV 설치가 감지되지 않음"
        }
    },
}