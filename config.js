export let defaultConfig = {
    useStartAsDefaultOffset: false,
    get defaultOffsetPosition() { return defaultConfig.useStartAsDefaultOffset ? "start" : "end" },
    autoSpace: true,
    allowText: true,
    deleteAfterMs: 10000,
    contentNodeAmount: 5,
    bannedWords: ["\n", "", "͏", "​", "‌", "‍", "﻿", "͏", "⁠", "⁣", "⁢", "⁤", "", "", "", "", "", "", "", "", "", "", ""],
    bannedEmotes: [],
    bannedUsers: [],
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
}

export const labels = {
    en: {
        scannerMethod: {
            main: "Scanner Method",
            alt: "Choose what to use to scan and detect incoming messages"
        },
        addButton: {
            main: "Add"
        },
        resetButton: {
            main: "Reset All"
        },
        setMessageBox: {
            main: "Message Box Settings",
            alt: "Change how the message boxes behave",
        },
        setInsert: {
            main: "Insert Settings",
            alt: "Adjust how inserter behaves",
        },
        mainTag: {
            main: "Effortless Chatting",
            alt: "Settings",
        },
        setScanner: {
            main: "Scanner Settings",
            alt: "Adjust how scanner behaves",
        },
        useStartAsDefaultOffset: {
            main: "Default Insert Position",
            alt: "Whether to insert a message to start or end if no cursor is available",
        },
        autoSpace: {
            main: "Automatic Space",
            alt: "Automatically put spaces when inserting a message",
        },
        allowText: {
            main: "Allow Text",
            alt: "Allow scanning of text messages",
        },
        deleteAfterMs: {
            main: "Message Lifespan",
            alt: "Time a scanned message is alive for",
        },
        contentNodeAmount: {
            main: "Message Box Amount",
            alt: "Amount of message boxes displayed",
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
            alt: "Allow scanning messages of bots",
        },
        scrapeMods: {
            main: "Allow Mods",
            alt: "Allow scanning messages of moderators",
        },
        scrapeVIPs: {
            main: "Allow VIPs",
            alt: "Allow scanning messages of VIPs",
        },
        scrapeOnlySubs: {
            main: "Allow Only Subscribers",
            alt: "Allow scanning only messages of subscribed users",
        },
        scrapeSubsWithMinimumMonths: {
            main: "Minimum Subscribed Month Requirement",
            alt: "Scans only users who have been subscribed for at least selected amount of months",
        },
        updateNodesAfterTimeout: {
            main: "Refresh Message Boxes After Lifespan Ends",
            alt: "Refreshes message boxes after lifespan of a message ends",
        },
        autoHide: {
            main: "Automatic Hide",
            alt: "Automatically hide extension panel when no messages are available",
        },
        scrapeAlreadySentMessages: {
            main: "Scan Existing Messages",
            alt: "Starts scanning from the messages already shown in chat",
        },
        requiredHoldTime: {
            main: "Hold Time For Automatic Send",
            alt: "Sends message after being held for this amount of time",
        },
        messageClickAnimationTime: {
            main: "Animation Length For Click",
            alt: "Time animation plays out when a message box has been clicked on",
        },
        other: {
            main: "Other",
            alt: "Other settings",
        },
        language: {
            main: "Language",
            alt: "Choose which language to use",
        },
        noMessages: {
            main: "No Messages Were Found"
        }
    },

    es: {
        scannerMethod: {
            main: "Método de Escaneo",
            alt: "Elige qué usar para escanear y detectar mensajes entrantes"
        },
        addButton: {
            main: "Agregar"
        },
        resetButton: {
            main: "Restablecer Todo"
        },
        setMessageBox: {
            main: "Configuración de Cajas de Mensajes",
            alt: "Cambia cómo se comportan las cajas de mensajes",
        },
        setInsert: {
            main: "Configuración de Inserción",
            alt: "Ajusta cómo se comporta el insertador",
        },
        mainTag: {
            main: "Effortless Chatting",
            alt: "Configuración",
        },
        setScanner: {
            main: "Configuración del Escáner",
            alt: "Ajusta cómo se comporta el escáner",
        },
        useStartAsDefaultOffset: {
            main: "Posición de Inserción Predeterminada",
            alt: "Inserta el mensaje al inicio o al final si no hay cursor disponible",
        },
        autoSpace: {
            main: "Espacio Automático",
            alt: "Agrega espacios automáticamente al insertar un mensaje",
        },
        allowText: {
            main: "Permitir Texto",
            alt: "Permite escanear mensajes de texto",
        },
        deleteAfterMs: {
            main: "Duración del Mensaje",
            alt: "Tiempo durante el cual un mensaje escaneado permanece activo",
        },
        contentNodeAmount: {
            main: "Cantidad de Cajas de Mensajes",
            alt: "Número de cajas de mensajes mostradas",
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
            alt: "Los mensajes de estos usuarios serán ignorados por el escáner",
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
            alt: "Escanea solo usuarios suscritos durante al menos la cantidad de meses seleccionada",
        },
        updateNodesAfterTimeout: {
            main: "Actualizar Cajas al Expirar",
            alt: "Actualiza las cajas de mensajes cuando finaliza la duración del mensaje",
        },
        autoHide: {
            main: "Ocultar Automáticamente",
            alt: "Oculta automáticamente el panel cuando no hay mensajes disponibles",
        },
        scrapeAlreadySentMessages: {
            main: "Escanear Historial",
            alt: "Comienza a escanear desde los mensajes ya mostrados",
        },
        requiredHoldTime: {
            main: "Tiempo de Pulsación para Envío",
            alt: "Envía el mensaje tras mantenerlo presionado este tiempo",
        },
        messageClickAnimationTime: {
            main: "Duración Animación Clic",
            alt: "Tiempo que dura la animación al hacer clic en una caja de mensaje",
        },
        other: {
            main: "Otros",
            alt: "Otras configuraciones",
        },
        language: {
            main: "Idioma",
            alt: "Elige el idioma a utilizar",
        },
        noMessages: {
            main: "No se encontraron mensajes"
        }
    },

    ja: {
        scannerMethod: {
            main: "スキャナー方式",
            alt: "メッセージを検出・スキャンする方法を選択します"
        },
        addButton: {
            main: "追加"
        },
        resetButton: {
            main: "すべてリセット"
        },
        setMessageBox: {
            main: "メッセージボックス設定",
            alt: "メッセージボックスの動作を変更します",
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
            alt: "スキャンされたメッセージが表示される時間",
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
            alt: "これらのユーザーのメッセージはスキャンされません",
        },
        scrapeBots: {
            main: "ボットを許可",
            alt: "ボットのメッセージをスキャンします",
        },
        scrapeMods: {
            main: "モデレーターを許可",
            alt: "モデレーターのメッセージをスキャンします",
        },
        scrapeVIPs: {
            main: "VIPを許可",
            alt: "VIPユーザーのメッセージをスキャンします",
        },
        scrapeOnlySubs: {
            main: "サブスクライバーのみ許可",
            alt: "サブスクライバーのメッセージのみをスキャンします",
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
            main: "既存ログをスキャン",
            alt: "すでに表示されているメッセージからスキャンを開始します",
        },
        requiredHoldTime: {
            main: "自動送信の長押し時間",
            alt: "メッセージボックスをこの時間長押しすると自動送信されます",
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
            alt: "使用する言語を選択します",
        },
        noMessages: {
            main: "メッセージが見つかりませんでした"
        }
    },

    de: {
        scannerMethod: {
            main: "Scan-Methode",
            alt: "Wähle aus, wie eingehende Nachrichten gescannt und erkannt werden"
        },
        addButton: {
            main: "Hinzufügen"
        },
        resetButton: {
            main: "Alles Zurücksetzen"
        },
        setMessageBox: {
            main: "Nachrichtenbox-Einstellungen",
            alt: "Ändere das Verhalten der Nachrichtenboxen",
        },
        setInsert: {
            main: "Einfüge-Einstellungen",
            alt: "Passe das Einfügeverhalten an",
        },
        mainTag: {
            main: "Effortless Chatting",
            alt: "Einstellungen",
        },
        setScanner: {
            main: "Scanner-Einstellungen",
            alt: "Passe das Verhalten des Scanners an",
        },
        useStartAsDefaultOffset: {
            main: "Standard-Einfügeposition",
            alt: "Fügt eine Nachricht am Anfang oder Ende ein, wenn kein Cursor verfügbar ist",
        },
        autoSpace: {
            main: "Automatischer Abstand",
            alt: "Fügt beim Einfügen einer Nachricht automatisch Leerzeichen hinzu",
        },
        allowText: {
            main: "Text Erlauben",
            alt: "Erlaubt das Scannen von Textnachrichten",
        },
        deleteAfterMs: {
            main: "Nachrichtenlebensdauer",
            alt: "Zeit, die eine gescannte Nachricht aktiv bleibt",
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
            alt: "Nachrichten dieser Benutzer werden vom Scanner ignoriert",
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
            main: "Minimale Abodauer (Monate)",
            alt: "Scannt nur Benutzer, die mindestens die ausgewählte Anzahl an Monaten abonniert sind",
        },
        updateNodesAfterTimeout: {
            main: "Boxen nach Ablauf aktualisieren",
            alt: "Aktualisiert Nachrichtenboxen nach Ablauf der Nachrichtenlebensdauer",
        },
        autoHide: {
            main: "Automatisch Ausblenden",
            alt: "Blendet das Panel automatisch aus, wenn keine Nachrichten verfügbar sind",
        },
        scrapeAlreadySentMessages: {
            main: "Chat-Verlauf Scannen",
            alt: "Beginnt mit dem Scannen der bereits angezeigten Nachrichten",
        },
        requiredHoldTime: {
            main: "Dauer für Auto-Senden",
            alt: "Sendet eine Nachricht, nachdem sie für diese Zeit gedrückt gehalten wurde",
        },
        messageClickAnimationTime: {
            main: "Animationsdauer beim Klicken",
            alt: "Dauer der Animation beim Klicken auf eine Nachrichtenbox",
        },
        other: {
            main: "Sonstiges",
            alt: "Weitere Einstellungen",
        },
        language: {
            main: "Sprache",
            alt: "Wähle die zu verwendende Sprache",
        },
        noMessages: {
            main: "Keine Nachrichten gefunden"
        }
    },

    fr: {
        scannerMethod: {
            main: "Méthode de Scan",
            alt: "Choisissez comment scanner et détecter les messages entrants"
        },
        addButton: {
            main: "Ajouter"
        },
        resetButton: {
            main: "Tout Réinitialiser"
        },
        setMessageBox: {
            main: "Réglages des Messages",
            alt: "Modifiez le comportement des boîtes de messages",
        },
        setInsert: {
            main: "Réglages d’Insertion",
            alt: "Ajustez le comportement de l’insertion",
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
            alt: "Insère un message au début ou à la fin si aucun curseur n’est disponible",
        },
        autoSpace: {
            main: "Espace Automatique",
            alt: "Ajoute automatiquement des espaces lors de l’insertion d’un message",
        },
        allowText: {
            main: "Autoriser le Texte",
            alt: "Autorise le scan des messages texte",
        },
        deleteAfterMs: {
            main: "Durée de Vie du Message",
            alt: "Durée pendant laquelle un message scanné reste actif",
        },
        contentNodeAmount: {
            main: "Nombre de Boîtes",
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
            alt: "Les messages de ces utilisateurs seront ignorés par le scanner",
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
            alt: "Autorise le scan des messages des utilisateurs VIP",
        },
        scrapeOnlySubs: {
            main: "Autoriser Uniquement les Abonnés",
            alt: "Scanne uniquement les messages des utilisateurs abonnés",
        },
        scrapeSubsWithMinimumMonths: {
            main: "Durée Min. d’Abonnement (Mois)",
            alt: "Scanne uniquement les utilisateurs abonnés depuis au moins le nombre de mois sélectionné",
        },
        updateNodesAfterTimeout: {
            main: "Actualiser Après Expiration",
            alt: "Actualise les boîtes de messages après la fin de la durée de vie",
        },
        autoHide: {
            main: "Masquage Automatique",
            alt: "Masque automatiquement le panneau lorsqu’aucun message n’est disponible",
        },
        scrapeAlreadySentMessages: {
            main: "Scanner l'Historique",
            alt: "Commence le scan à partir des messages déjà affichés",
        },
        requiredHoldTime: {
            main: "Durée d'Appui pour Envoi",
            alt: "Envoie le message après avoir maintenu l'appui ce laps de temps",
        },
        messageClickAnimationTime: {
            main: "Durée de l’Animation au Clic",
            alt: "Durée de l’animation lors du clic sur une boîte de message",
        },
        other: {
            main: "Autres",
            alt: "Autres paramètres",
        },
        language: {
            main: "Langue",
            alt: "Choisissez la langue à utiliser",
        },
        noMessages: {
            main: "Aucun message trouvé"
        }
    },

    ko: {
        scannerMethod: {
            main: "스캐너 방식",
            alt: "들어오는 메시지를 감지하고 스캔할 방식을 선택합니다"
        },
        addButton: {
            main: "추가"
        },
        resetButton: {
            main: "모두 초기화"
        },
        setMessageBox: {
            main: "메시지 박스 설정",
            alt: "메시지 박스의 동작을 변경합니다",
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
            alt: "스캔된 메시지가 유지되는 시간",
        },
        contentNodeAmount: {
            main: "메시지 박스 수",
            alt: "표시되는 메시지 박스의 개수",
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
            alt: "이 사용자들의 메시지는 스캔되지 않습니다",
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
            main: "최소 구독 기간 (개월)",
            alt: "선택한 개월 수 이상 구독한 사용자만 스캔합니다",
        },
        updateNodesAfterTimeout: {
            main: "시간 만료 후 새로고침",
            alt: "메시지 유지 시간이 끝난 후 메시지 박스를 새로고침합니다",
        },
        autoHide: {
            main: "자동 숨김",
            alt: "표시할 메시지가 없을 경우 패널을 자동으로 숨깁니다",
        },
        scrapeAlreadySentMessages: {
            main: "기존 메시지 스캔",
            alt: "이미 표시된 메시지부터 스캔을 시작합니다",
        },
        requiredHoldTime: {
            main: "자동 전송 길게 누르기 시간",
            alt: "메시지 박스를 이 시간 동안 누르고 있으면 자동으로 전송됩니다",
        },
        messageClickAnimationTime: {
            main: "클릭 애니메이션 시간",
            alt: "메시지 박스를 클릭했을 때 재생되는 애니메이션 시간",
        },
        other: {
            main: "기타",
            alt: "기타 설정",
        },
        language: {
            main: "언어",
            alt: "사용할 언어를 선택합니다",
        },
        noMessages: {
            main: "메시지를 찾을 수 없습니다"
        }
    },
}