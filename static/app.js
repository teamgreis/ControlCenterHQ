/* ============================================================
   Atlas AdminSysOP – Frontend Application
   © Felix Greis | Atlas GmbH 2026 – All rights reserved.
   Atlas AdminSysOP – Unauthorized modification prohibited.
   ============================================================ */

const ATLAS_COPYRIGHT = "Felix Greis | Atlas GmbH 2026";
const ATLAS_APP = "Atlas AdminSysOP";

const ATLAS = {

/* ============================================================
   i18n – Internationalization
============================================================ */
i18n: {
  lang: localStorage.getItem('atlas_lang') || 'en',
  strings: {
    en: {
      dashboard: 'Dashboard', map: 'Command & Control', incidents: 'Incidents',
      alerts: 'Alerts', chat: 'Communication', sensors: 'Sensors',
      logs: 'Data Logs', analytics: 'AI Analytics', fleet: 'Fleet Management',
      navigation: 'Navigation', users: 'Users', modules: 'Modules', settings: 'Settings',
      login: 'Sign In', logout: 'Logout', username: 'Username', password: 'Password',
      save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', create: 'Create',
      add: 'Add', close: 'Close', confirm: 'Confirm', search: 'Search',
      loading: 'Loading...', error: 'Error', success: 'Success', warning: 'Warning',
      critical: 'Critical', info: 'Info', open: 'Open', resolved: 'Resolved',
      in_progress: 'In Progress', active: 'Active', inactive: 'Inactive',
      available: 'Available', on_trip: 'On Trip', maintenance: 'Maintenance',
      out_of_service: 'Out of Service', acknowledge: 'Acknowledge', ack_all: 'Ack All',
      new_incident: 'New Incident', new_alert: 'New Alert', new_asset: 'New Asset',
      new_vehicle: 'New Vehicle', new_driver: 'New Driver', new_trip: 'New Trip',
      new_maintenance: 'New Maintenance', add_fuel: 'Add Fuel Log',
      title: 'Title', description: 'Description', severity: 'Severity', status: 'Status',
      name: 'Name', type: 'Type', location: 'Location', date: 'Date',
      vehicle: 'Vehicle', driver: 'Driver', origin: 'Origin', destination: 'Destination',
      departure: 'Departure', arrival: 'Arrival', distance: 'Distance',
      cost: 'Cost', liters: 'Liters', odometer: 'Odometer',
      license_plate: 'License Plate', vin: 'VIN', make: 'Make', model: 'Model',
      year: 'Year', color: 'Color', seats: 'Seats', fuel_type: 'Fuel Type',
      insurance_expiry: 'Insurance Expiry', tuev_expiry: 'TÜV / Inspection',
      role: 'Role', admin: 'Admin', operator: 'Operator', viewer: 'Viewer',
      theme: 'Theme', language: 'Language', online: 'Online', offline: 'Offline',
      send: 'Send', message: 'Message', rooms: 'Rooms', direct_messages: 'Direct Messages',
      navigate_to: 'Navigate To', start_navigation: 'Start Navigation',
      recalculating: 'Recalculating...', arrived: 'You have arrived!',
      turn_left: 'Turn left', turn_right: 'Turn right', continue_straight: 'Continue straight',
      by_car: 'By Car', by_bike: 'By Bike', on_foot: 'On Foot',
      eta: 'ETA', total_distance: 'Total Distance',
      alert_tone: 'Alert Tone', test_tone: 'Test Tone',
      export_csv: 'Export CSV', export_json: 'Export JSON',
      no_data: 'No data available', refresh: 'Refresh',
      enabled: 'Enabled', disabled: 'Disabled', toggle: 'Toggle',
      overview: 'Overview', details: 'Details', history: 'History',
      fleet_stats: 'Fleet Statistics', maintenance_due: 'Maintenance Due',
      pre_trip: 'Pre-Trip', post_trip: 'Post-Trip', inspection: 'Inspection',
      documents: 'Documents', fuel_log: 'Fuel Log', trips: 'Trips',
      drivers: 'Drivers', vehicles: 'Vehicles',
      anomalies: 'Anomalies', predictions: 'Predictions', patterns: 'Patterns',
      org_name: 'Organization Name', facility_type: 'Facility Type',
      copyright: '© Felix Greis | Atlas GmbH 2026',
      invalid_credentials: 'Invalid username or password',
      default_hint: '',
      pager: 'Pager Gateway', scheduler: 'Scheduler',
      pager_rx: 'Receive (POCSAG)', pager_tx: 'Send (DAPNET)', pager_channels: 'Push Channels',
      capcode: 'Capcode', rx_running: 'RX Running', rx_stopped: 'RX Stopped',
      start_rx: 'Start Receiver', stop_rx: 'Stop Receiver',
      dapnet_config: 'DAPNET Config', ntfy_config: 'ntfy Config', apprise_config: 'Apprise Config',
      send_to_pager: 'Send via DAPNET', pager_test_ok: 'Test OK', pager_test_fail: 'Test failed',
      callsign: 'Callsign', target_callsigns: 'Target Callsigns',
      transmitter_group: 'Transmitter Group', ntfy_url: 'ntfy Server URL',
      ntfy_topic: 'Topic', ntfy_token: 'Access Token',
      apprise_urls: 'Apprise URLs (one per line)', rx_frequency: 'Frequency (MHz)',
      rx_gain: 'Gain', rx_filter_capcodes: 'Filter Capcodes (comma-separated)',
      rx_create_alerts: 'Create Atlas Alerts from RX',
      channels: 'Active Channels', webpush_status: 'Web Push Status',
      scheduled: 'Scheduled Items', new_scheduled: 'New Scheduled Item',
      recurrence: 'Recurrence', once: 'Once', daily: 'Daily', weekly: 'Weekly',
      hourly: 'Hourly', interval: 'Every N minutes',
      next_run: 'Next Run', last_run: 'Last Run', run_count: 'Run Count',
      run_now: 'Run Now', schedule_alert: 'Scheduled Alert', schedule_incident: 'Scheduled Incident',
      interval_minutes: 'Interval (minutes)',
      // Weather
      weather: 'Weather', weather_current: 'Current Weather', weather_forecast: 'Forecast',
      temp: 'Temperature', humidity: 'Humidity', wind: 'Wind Speed', feels_like: 'Feels Like',
      // Calendar
      calendar: 'Calendar', new_event: 'New Event', vacation: 'Vacation', duty: 'Duty Shift', event: 'Event',
      pending: 'Pending', approved: 'Approved', rejected: 'Rejected',
      approve: 'Approve', reject: 'Reject', all_day: 'All Day',
      // Travel
      travel: 'Travel Requests', new_travel: 'New Travel Request',
      travel_type: 'Travel Type', solo: 'Solo', with_crew: 'With Crew',
      passengers: 'Passengers', reviewer_notes: 'Reviewer Notes',
      accept_counteroffer: 'Accept', reject_counteroffer: 'Reject Counter-offer',
      // Permissions
      permissions: 'Permissions', user_groups: 'User Groups', new_group: 'New Group',
      base_role: 'Base Role', dispatcher: 'Dispatcher', abteilleitung: 'Department Head',
      can_delete_alerts: 'Delete Alerts', can_ack_all: 'Acknowledge All',
      can_manage_users: 'Manage Users', can_manage_fleet: 'Manage Fleet',
      can_view_logs: 'View Logs', can_send_pager: 'Send Pager',
      can_restart: 'Restart Server', can_backup: 'Create Backup',
      can_manage_calendar: 'Manage Calendar', can_approve_travel: 'Approve Travel',
      // Backup & System
      backup: 'Backup', restore: 'Restore', server_restart: 'Restart Server',
      pi_sensors: 'Pi Sensors', cpu_temp: 'CPU Temperature', cpu_voltage: 'CPU Voltage',
      // Map layers
      map_layer: 'Map Layer', map_osm: 'OpenStreetMap', map_satellite: 'Satellite',
      map_topo: 'Topographic', map_dark: 'Dark', map_transport: 'Transport',
      map_water: 'Nautical / Water',
      // Gotify
      gotify_config: 'Gotify Config', gotify_url: 'Gotify URL', gotify_token: 'Gotify Token',
      gotify_priority: 'Priority',
      // Navigation extra
      flight_mode: 'Flight Mode', boat_mode: 'Boat / Water Mode',
      route_options: 'Route Options', route_fastest: 'Fastest', route_shortest: 'Shortest', route_avoid_highways: 'Avoid Highways',
      // Vehicle fuel
      fuel_capacity: 'Tank Capacity (L)', fuel_current: 'Current Fuel (L)', fuel_avg: 'Avg. Consumption (L/100km)',
      fuel_range: 'Estimated Range', update_position: 'Update Position', complete_trip: 'Complete Trip',
      fuel_used: 'Fuel Used (L)', end_position: 'End Position', completed_notes: 'Completion Notes',
      // Alarm
      alarm_active: 'ALARM ACTIVE', dismiss_alarm: 'Dismiss',
    },
    de: {
      dashboard: 'Dashboard', map: 'Lagekarte', incidents: 'Vorfälle',
      alerts: 'Alarme', chat: 'Kommunikation', sensors: 'Sensoren',
      logs: 'Datenlogs', analytics: 'KI-Analytik', fleet: 'Fuhrparkmanagement',
      navigation: 'Navigation', users: 'Benutzer', modules: 'Module', settings: 'Einstellungen',
      login: 'Anmelden', logout: 'Abmelden', username: 'Benutzername', password: 'Passwort',
      save: 'Speichern', cancel: 'Abbrechen', delete: 'Löschen', edit: 'Bearbeiten', create: 'Erstellen',
      add: 'Hinzufügen', close: 'Schließen', confirm: 'Bestätigen', search: 'Suchen',
      loading: 'Laden...', error: 'Fehler', success: 'Erfolg', warning: 'Warnung',
      critical: 'Kritisch', info: 'Info', open: 'Offen', resolved: 'Gelöst',
      in_progress: 'In Bearbeitung', active: 'Aktiv', inactive: 'Inaktiv',
      available: 'Verfügbar', on_trip: 'Auf Tour', maintenance: 'In Wartung',
      out_of_service: 'Außer Betrieb', acknowledge: 'Bestätigen', ack_all: 'Alle best.',
      new_incident: 'Neuer Vorfall', new_alert: 'Neuer Alarm', new_asset: 'Neues Asset',
      new_vehicle: 'Neues Fahrzeug', new_driver: 'Neuer Fahrer', new_trip: 'Neue Tour',
      new_maintenance: 'Neue Wartung', add_fuel: 'Tankeintrag',
      title: 'Titel', description: 'Beschreibung', severity: 'Schwere', status: 'Status',
      name: 'Name', type: 'Typ', location: 'Standort', date: 'Datum',
      vehicle: 'Fahrzeug', driver: 'Fahrer', origin: 'Startpunkt', destination: 'Ziel',
      departure: 'Abfahrt', arrival: 'Ankunft', distance: 'Distanz',
      cost: 'Kosten', liters: 'Liter', odometer: 'Kilometerstand',
      license_plate: 'Kennzeichen', vin: 'Fahrzeugidentifikationsnummer', make: 'Hersteller', model: 'Modell',
      year: 'Baujahr', color: 'Farbe', seats: 'Sitze', fuel_type: 'Kraftstoffart',
      insurance_expiry: 'Versicherungsablauf', tuev_expiry: 'TÜV-Datum',
      role: 'Rolle', admin: 'Administrator', operator: 'Operator', viewer: 'Zuschauer',
      theme: 'Design', language: 'Sprache', online: 'Online', offline: 'Offline',
      send: 'Senden', message: 'Nachricht', rooms: 'Räume', direct_messages: 'Direktnachrichten',
      navigate_to: 'Navigieren nach', start_navigation: 'Navigation starten',
      recalculating: 'Neu berechnen...', arrived: 'Sie haben Ihr Ziel erreicht!',
      turn_left: 'Links abbiegen', turn_right: 'Rechts abbiegen', continue_straight: 'Geradeaus fahren',
      by_car: 'Mit dem Auto', by_bike: 'Mit dem Fahrrad', on_foot: 'Zu Fuß',
      eta: 'Ankunft', total_distance: 'Gesamtdistanz',
      alert_tone: 'Alarmton', test_tone: 'Ton testen',
      export_csv: 'CSV exportieren', export_json: 'JSON exportieren',
      no_data: 'Keine Daten verfügbar', refresh: 'Aktualisieren',
      enabled: 'Aktiviert', disabled: 'Deaktiviert', toggle: 'Umschalten',
      overview: 'Übersicht', details: 'Details', history: 'Verlauf',
      fleet_stats: 'Fuhrpark-Statistik', maintenance_due: 'Wartung fällig',
      pre_trip: 'Vor der Fahrt', post_trip: 'Nach der Fahrt', inspection: 'Inspektion',
      documents: 'Dokumente', fuel_log: 'Tankprotokoll', trips: 'Touren',
      drivers: 'Fahrer', vehicles: 'Fahrzeuge',
      anomalies: 'Anomalien', predictions: 'Vorhersagen', patterns: 'Muster',
      org_name: 'Organisationsname', facility_type: 'Einrichtungstyp',
      copyright: '© Felix Greis | Atlas GmbH 2026',
      invalid_credentials: 'Ungültiger Benutzername oder Passwort',
      default_hint: '',
      pager: 'Pager Gateway', scheduler: 'Planer',
      pager_rx: 'Empfangen (POCSAG)', pager_tx: 'Senden (DAPNET)', pager_channels: 'Push-Kanäle',
      capcode: 'Capcode', rx_running: 'Empfänger aktiv', rx_stopped: 'Empfänger gestoppt',
      start_rx: 'Empfänger starten', stop_rx: 'Empfänger stoppen',
      dapnet_config: 'DAPNET-Konfiguration', ntfy_config: 'ntfy-Konfiguration', apprise_config: 'Apprise-Konfiguration',
      send_to_pager: 'Via DAPNET senden', pager_test_ok: 'Test OK', pager_test_fail: 'Test fehlgeschlagen',
      callsign: 'Rufzeichen', target_callsigns: 'Ziel-Rufzeichen',
      transmitter_group: 'Sendergruppe', ntfy_url: 'ntfy-Server-URL',
      ntfy_topic: 'Thema', ntfy_token: 'Zugriffstoken',
      apprise_urls: 'Apprise URLs (eine pro Zeile)', rx_frequency: 'Frequenz (MHz)',
      rx_gain: 'Verstärkung', rx_filter_capcodes: 'Capcode-Filter (kommagetrennt)',
      rx_create_alerts: 'Atlas-Alarme aus Empfang erstellen',
      channels: 'Aktive Kanäle', webpush_status: 'Web-Push-Status',
      scheduled: 'Geplante Elemente', new_scheduled: 'Neues geplantes Element',
      recurrence: 'Wiederholung', once: 'Einmalig', daily: 'Täglich', weekly: 'Wöchentlich',
      hourly: 'Stündlich', interval: 'Alle N Minuten',
      next_run: 'Nächste Ausführung', last_run: 'Letzte Ausführung', run_count: 'Ausführungen',
      run_now: 'Jetzt ausführen', schedule_alert: 'Geplanter Alarm', schedule_incident: 'Geplanter Vorfall',
      interval_minutes: 'Intervall (Minuten)',
      weather: 'Wetter', weather_current: 'Aktuelles Wetter', weather_forecast: 'Vorhersage',
      temp: 'Temperatur', humidity: 'Luftfeuchtigkeit', wind: 'Windgeschwindigkeit', feels_like: 'Gefühlt',
      calendar: 'Kalender', new_event: 'Neuer Eintrag', vacation: 'Urlaub', duty: 'Dienstschicht', event: 'Ereignis',
      pending: 'Ausstehend', approved: 'Genehmigt', rejected: 'Abgelehnt',
      approve: 'Genehmigen', reject: 'Ablehnen', all_day: 'Ganztägig',
      travel: 'Reiseanträge', new_travel: 'Neuer Reiseantrag',
      travel_type: 'Reiseart', solo: 'Allein', with_crew: 'Mit Besatzung',
      passengers: 'Mitreisende', reviewer_notes: 'Prüfnotizen',
      accept_counteroffer: 'Akzeptieren', reject_counteroffer: 'Gegenangebot ablehnen',
      permissions: 'Berechtigungen', user_groups: 'Benutzergruppen', new_group: 'Neue Gruppe',
      base_role: 'Basisrolle', dispatcher: 'Dispatcher', abteilleitung: 'Abteilungsleitung',
      can_delete_alerts: 'Alarme löschen', can_ack_all: 'Alle bestätigen',
      can_manage_users: 'Benutzer verwalten', can_manage_fleet: 'Fuhrpark verwalten',
      can_view_logs: 'Logs einsehen', can_send_pager: 'Pager senden',
      can_restart: 'Server neustarten', can_backup: 'Backup erstellen',
      can_manage_calendar: 'Kalender verwalten', can_approve_travel: 'Reisen genehmigen',
      backup: 'Backup', restore: 'Wiederherstellen', server_restart: 'Server neustarten',
      pi_sensors: 'Pi-Sensoren', cpu_temp: 'CPU-Temperatur', cpu_voltage: 'CPU-Spannung',
      map_layer: 'Kartenebene', map_osm: 'OpenStreetMap', map_satellite: 'Satellit',
      map_topo: 'Topografie', map_dark: 'Dunkel', map_transport: 'Transport',
      map_water: 'Nautisch / Wasser',
      gotify_config: 'Gotify-Konfiguration', gotify_url: 'Gotify-URL', gotify_token: 'Gotify-Token',
      gotify_priority: 'Priorität',
      flight_mode: 'Flugmodus', boat_mode: 'Boots- / Wassermodus',
      route_options: 'Routenoptionen', route_fastest: 'Schnellste', route_shortest: 'Kürzeste', route_avoid_highways: 'Autobahn meiden',
      fuel_capacity: 'Tankinhalt (L)', fuel_current: 'Aktueller Kraftstoff (L)', fuel_avg: 'Ø-Verbrauch (L/100km)',
      fuel_range: 'Geschätzte Reichweite', update_position: 'Position aktualisieren', complete_trip: 'Tour abschließen',
      fuel_used: 'Verbrauchter Kraftstoff (L)', end_position: 'Endposition', completed_notes: 'Abschlussnotizen',
      alarm_active: 'ALARM AKTIV', dismiss_alarm: 'Quittieren',
    },
    fr: {
      dashboard: 'Tableau de bord', map: 'Commande & Contrôle', incidents: 'Incidents',
      alerts: 'Alertes', chat: 'Communication', sensors: 'Capteurs',
      logs: 'Journaux', analytics: 'Analytique IA', fleet: 'Gestion de flotte',
      navigation: 'Navigation', users: 'Utilisateurs', modules: 'Modules', settings: 'Paramètres',
      login: 'Connexion', logout: 'Déconnexion', username: 'Identifiant', password: 'Mot de passe',
      save: 'Enregistrer', cancel: 'Annuler', delete: 'Supprimer', edit: 'Modifier', create: 'Créer',
      add: 'Ajouter', close: 'Fermer', confirm: 'Confirmer', search: 'Rechercher',
      loading: 'Chargement...', error: 'Erreur', success: 'Succès', warning: 'Avertissement',
      critical: 'Critique', info: 'Info', open: 'Ouvert', resolved: 'Résolu',
      in_progress: 'En cours', active: 'Actif', inactive: 'Inactif',
      available: 'Disponible', on_trip: 'En déplacement', maintenance: 'En maintenance',
      out_of_service: 'Hors service', acknowledge: 'Acquitter', ack_all: 'Tout acquitter',
      new_incident: 'Nouvel incident', new_alert: 'Nouvelle alerte', new_asset: 'Nouvel actif',
      new_vehicle: 'Nouveau véhicule', new_driver: 'Nouveau conducteur', new_trip: 'Nouveau trajet',
      new_maintenance: 'Nouvelle maintenance', add_fuel: 'Ajouter carburant',
      title: 'Titre', description: 'Description', severity: 'Sévérité', status: 'Statut',
      name: 'Nom', type: 'Type', location: 'Emplacement', date: 'Date',
      vehicle: 'Véhicule', driver: 'Conducteur', origin: 'Origine', destination: 'Destination',
      departure: 'Départ', arrival: 'Arrivée', distance: 'Distance',
      cost: 'Coût', liters: 'Litres', odometer: 'Kilométrage',
      license_plate: 'Plaque d\'immatriculation', vin: 'NIV', make: 'Marque', model: 'Modèle',
      year: 'Année', color: 'Couleur', seats: 'Sièges', fuel_type: 'Carburant',
      insurance_expiry: 'Expiration assurance', tuev_expiry: 'Contrôle technique',
      role: 'Rôle', admin: 'Administrateur', operator: 'Opérateur', viewer: 'Observateur',
      theme: 'Thème', language: 'Langue', online: 'En ligne', offline: 'Hors ligne',
      send: 'Envoyer', message: 'Message', rooms: 'Salles', direct_messages: 'Messages directs',
      navigate_to: 'Naviguer vers', start_navigation: 'Démarrer la navigation',
      recalculating: 'Recalcul...', arrived: 'Vous êtes arrivé!',
      turn_left: 'Tourner à gauche', turn_right: 'Tourner à droite', continue_straight: 'Continuer tout droit',
      by_car: 'En voiture', by_bike: 'À vélo', on_foot: 'À pied',
      eta: 'Heure d\'arrivée', total_distance: 'Distance totale',
      alert_tone: 'Tonalité d\'alerte', test_tone: 'Tester le son',
      export_csv: 'Exporter CSV', export_json: 'Exporter JSON',
      no_data: 'Aucune donnée disponible', refresh: 'Actualiser',
      enabled: 'Activé', disabled: 'Désactivé', toggle: 'Basculer',
      overview: 'Aperçu', details: 'Détails', history: 'Historique',
      fleet_stats: 'Statistiques de flotte', maintenance_due: 'Maintenance requise',
      pre_trip: 'Avant le trajet', post_trip: 'Après le trajet', inspection: 'Inspection',
      documents: 'Documents', fuel_log: 'Journal de carburant', trips: 'Trajets',
      drivers: 'Conducteurs', vehicles: 'Véhicules',
      anomalies: 'Anomalies', predictions: 'Prédictions', patterns: 'Modèles',
      org_name: 'Nom de l\'organisation', facility_type: 'Type d\'établissement',
      copyright: '© Felix Greis | Atlas GmbH 2026',
      invalid_credentials: 'Identifiant ou mot de passe invalide',
      default_hint: '',
      pager: 'Passerelle Pager', scheduler: 'Planificateur',
      pager_rx: 'Réception (POCSAG)', pager_tx: 'Envoi (DAPNET)', pager_channels: 'Canaux Push',
      capcode: 'Capcode', rx_running: 'Récepteur actif', rx_stopped: 'Récepteur arrêté',
      start_rx: 'Démarrer récepteur', stop_rx: 'Arrêter récepteur',
      dapnet_config: 'Config DAPNET', ntfy_config: 'Config ntfy', apprise_config: 'Config Apprise',
      send_to_pager: 'Envoyer via DAPNET', pager_test_ok: 'Test OK', pager_test_fail: 'Test échoué',
      callsign: 'Indicatif', target_callsigns: 'Indicatifs cibles',
      transmitter_group: 'Groupe émetteur', ntfy_url: 'URL serveur ntfy',
      ntfy_topic: 'Sujet', ntfy_token: 'Jeton d\'accès',
      apprise_urls: 'URLs Apprise (une par ligne)', rx_frequency: 'Fréquence (MHz)',
      rx_gain: 'Gain', rx_filter_capcodes: 'Filtres Capcode (séparés par virgule)',
      rx_create_alerts: 'Créer alertes Atlas depuis réception',
      channels: 'Canaux actifs', webpush_status: 'Statut Web Push',
      scheduled: 'Éléments planifiés', new_scheduled: 'Nouvel élément planifié',
      recurrence: 'Récurrence', once: 'Une fois', daily: 'Quotidien', weekly: 'Hebdomadaire',
      hourly: 'Horaire', interval: 'Toutes les N minutes',
      next_run: 'Prochaine exécution', last_run: 'Dernière exécution', run_count: 'Exécutions',
      run_now: 'Exécuter maintenant', schedule_alert: 'Alerte planifiée', schedule_incident: 'Incident planifié',
      interval_minutes: 'Intervalle (minutes)',
      weather: 'Météo', weather_current: 'Météo actuelle', weather_forecast: 'Prévisions',
      temp: 'Température', humidity: 'Humidité', wind: 'Vitesse du vent', feels_like: 'Ressenti',
      calendar: 'Calendrier', new_event: 'Nouvel événement', vacation: 'Vacances', duty: 'Service', event: 'Événement',
      pending: 'En attente', approved: 'Approuvé', rejected: 'Rejeté',
      approve: 'Approuver', reject: 'Rejeter', all_day: 'Toute la journée',
      travel: 'Demandes de voyage', new_travel: 'Nouvelle demande',
      travel_type: 'Type de voyage', solo: 'Solo', with_crew: 'Avec équipage',
      passengers: 'Passagers', reviewer_notes: 'Notes du réviseur',
      accept_counteroffer: 'Accepter', reject_counteroffer: 'Refuser la contre-offre',
      permissions: 'Permissions', user_groups: 'Groupes d\'utilisateurs', new_group: 'Nouveau groupe',
      base_role: 'Rôle de base', dispatcher: 'Dispatcher', abteilleitung: 'Chef de département',
      can_delete_alerts: 'Supprimer alertes', can_ack_all: 'Acquitter tout',
      can_manage_users: 'Gérer utilisateurs', can_manage_fleet: 'Gérer flotte',
      can_view_logs: 'Voir journaux', can_send_pager: 'Envoyer pager',
      can_restart: 'Redémarrer serveur', can_backup: 'Créer sauvegarde',
      can_manage_calendar: 'Gérer calendrier', can_approve_travel: 'Approuver voyages',
      backup: 'Sauvegarde', restore: 'Restaurer', server_restart: 'Redémarrer serveur',
      pi_sensors: 'Capteurs Pi', cpu_temp: 'Température CPU', cpu_voltage: 'Tension CPU',
      map_layer: 'Couche de carte', map_osm: 'OpenStreetMap', map_satellite: 'Satellite',
      map_topo: 'Topographique', map_dark: 'Sombre', map_transport: 'Transport',
      map_water: 'Nautique / Eau',
      gotify_config: 'Config Gotify', gotify_url: 'URL Gotify', gotify_token: 'Token Gotify',
      gotify_priority: 'Priorité',
      flight_mode: 'Mode vol', boat_mode: 'Mode bateau / eau',
      route_options: 'Options d\'itinéraire', route_fastest: 'Plus rapide', route_shortest: 'Plus court', route_avoid_highways: 'Éviter autoroutes',
      fuel_capacity: 'Capacité réservoir (L)', fuel_current: 'Carburant actuel (L)', fuel_avg: 'Conso. moy. (L/100km)',
      fuel_range: 'Autonomie estimée', update_position: 'Mettre à jour position', complete_trip: 'Terminer le trajet',
      fuel_used: 'Carburant utilisé (L)', end_position: 'Position finale', completed_notes: 'Notes de fin',
      alarm_active: 'ALARME ACTIVE', dismiss_alarm: 'Acquitter',
    }
  },
  t(key) {
    return this.strings[this.lang]?.[key] || this.strings.en[key] || key;
  },
  setLang(lang) {
    this.lang = lang;
    localStorage.setItem('atlas_lang', lang);
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById('lang-' + lang);
    if (btn) btn.classList.add('active');
    ATLAS.ui.applyTranslations();
    if (ATLAS.state.currentPage) ATLAS.router.go(ATLAS.state.currentPage, true);
  }
},

/* ============================================================
   State
============================================================ */
state: {
  user: null,
  token: null,
  currentPage: null,
  modules: [],
  assets: [],
  incidents: [],
  alerts: [],
  sensors: [],
  onlineUsers: [],
  chatRooms: [],
  currentRoom: null,
  mapInstance: null,
  mapMarkers: {},
  fleetMapMarkers: {},
  charts: {},
  navRoute: null,
  navStep: 0,
  navWatchId: null,
  audioCtx: null,
},

/* ============================================================
   API
============================================================ */
api: {
  base: '',
  async req(method, path, body) {
    const opts = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(ATLAS.state.token ? { 'Authorization': `Bearer ${ATLAS.state.token}` } : {}),
        'Accept-Language': ATLAS.i18n.lang,
      }
    };
    if (body !== undefined) opts.body = JSON.stringify(body);
    const res = await fetch(this.base + path, opts);
    if (res.status === 401) { ATLAS.auth.doLogout(); return null; }
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(err.detail || 'Request failed');
    }
    if (res.status === 204) return null;
    return res.json();
  },
  get(path) { return this.req('GET', path); },
  post(path, body) { return this.req('POST', path, body); },
  put(path, body) { return this.req('PUT', path, body); },
  delete(path) { return this.req('DELETE', path); },
},

/* ============================================================
   WebSocket
============================================================ */
ws: {
  socket: null,
  handlers: {},
  pingInterval: null,

  connect() {
    if (this.socket) this.socket.close();
    const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
    this.socket = new WebSocket(`${proto}//${location.host}/ws/${ATLAS.state.token}`);
    this.socket.onopen = () => {
      console.log('WS connected');
      this.pingInterval = setInterval(() => {
        if (this.socket.readyState === WebSocket.OPEN)
          this.socket.send(JSON.stringify({ type: 'ping' }));
      }, 30000);
    };
    this.socket.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        ATLAS.ws.dispatch(msg);
      } catch {}
    };
    this.socket.onclose = () => {
      clearInterval(this.pingInterval);
      setTimeout(() => ATLAS.ws.connect(), 3000);
    };
  },

  on(type, handler) {
    if (!this.handlers[type]) this.handlers[type] = [];
    this.handlers[type].push(handler);
  },

  dispatch(msg) {
    const { type, data } = msg;
    // Built-in handlers
    switch(type) {
      case 'alert_new':
        ATLAS.state.alerts.unshift(data);
        ATLAS.alerts.onNew(data);
        break;
      case 'alert_ack':
        ATLAS.alerts.onAck(data.id);
        break;
      case 'alerts_all_ack':
        ATLAS.state.alerts.forEach(a => a.acknowledged = 1);
        ATLAS.alerts.updateBanner();
        break;
      case 'asset_move':
        ATLAS.map.moveMarker(data.id, data.lat, data.lng);
        break;
      case 'asset_new':
        ATLAS.state.assets.push(data);
        ATLAS.map.addAssetMarker(data);
        break;
      case 'incident_new':
        ATLAS.state.incidents.unshift(data);
        break;
      case 'chat_message':
        ATLAS.chat.onMessage(data);
        break;
      case 'dm_message':
        ATLAS.chat.onDM(data);
        break;
      case 'sensor_reading':
        ATLAS.sensors.onReading(data);
        break;
      case 'user_online':
        if (!ATLAS.state.onlineUsers.includes(data.user_id))
          ATLAS.state.onlineUsers.push(data.user_id);
        ATLAS.ui.updateOnlineCount();
        break;
      case 'user_offline':
        ATLAS.state.onlineUsers = ATLAS.state.onlineUsers.filter(id => id !== data.user_id);
        ATLAS.ui.updateOnlineCount();
        break;
      case 'fleet_vehicle_move':
        ATLAS.fleet.moveVehicleMarker(data.id, data.lat, data.lng);
        break;
      case 'module_toggled':
        ATLAS.modules.onToggle(data);
        break;
      case 'pager_rx':
        if (ATLAS.state.currentPage === 'pager') ATLAS.pagerPage.onRxMessage(data);
        break;
      case 'scheduled_fired':
        ATLAS.ui.toast(`⏰ ${data.title}`, data.severity === 'critical' ? 'error' : data.severity === 'warning' ? 'warning' : 'info');
        if (ATLAS.state.currentPage === 'scheduler') ATLAS.schedulerPage.refresh();
        break;
      case 'alert_deleted':
        ATLAS.state.alerts = ATLAS.state.alerts.filter(a => a.id !== data.id);
        ATLAS.alerts.updateBanner();
        if (ATLAS.state.currentPage === 'alerts') ATLAS.alertsPage.render(document.getElementById('page-content'));
        break;
      case 'calendar_new':
        if (ATLAS.state.currentPage === 'calendar') ATLAS.calendarPage.load();
        break;
      case 'travel_new':
      case 'travel_update':
        if (ATLAS.state.currentPage === 'travel') ATLAS.travelPage.load();
        if (data.requester_id === ATLAS.state.user?.id)
          ATLAS.ui.toast(`✈️ Travel request ${data.status}`, data.status==='approved'?'success':'info');
        break;
      case 'fleet_position_update':
        if (ATLAS.state.currentPage === 'map' && ATLAS.map.fleetLayer) {
          // Refresh fleet layer marker
        }
        break;
    }
    // Custom handlers
    (this.handlers[type] || []).forEach(h => h(data));
  },

  disconnect() {
    clearInterval(this.pingInterval);
    if (this.socket) { this.socket.onclose = null; this.socket.close(); }
  }
},

/* ============================================================
   Auth
============================================================ */
auth: {
  async login() {
    const user = document.getElementById('login-user').value.trim();
    const pass = document.getElementById('login-pass').value;
    const btn = document.getElementById('login-btn');
    const err = document.getElementById('login-error');
    if (!user || !pass) return;
    btn.disabled = true;
    document.getElementById('login-btn-text').textContent = ATLAS.i18n.t('loading');
    err.classList.add('hidden');
    try {
      const res = await ATLAS.api.post('/api/auth/login', { username: user, password: pass });
      if (!res) return;
      ATLAS.state.token = res.token;
      ATLAS.state.user = res.user;
      localStorage.setItem('atlas_token', res.token);
      // Apply user's saved theme and language
      if (res.user.theme) ATLAS.ui.applyTheme(res.user.theme);
      if (res.user.language) ATLAS.i18n.lang = res.user.language;
      // Verify copyright with server
      const info = await ATLAS.api.get('/api/info');
      if (info && info.copyright !== ATLAS_COPYRIGHT) {
        document.getElementById('login-error').textContent = 'Copyright integrity failed. Contact administrator.';
        document.getElementById('login-error').classList.remove('hidden');
        return;
      }
      ATLAS.ws.connect();
      await ATLAS.boot();
    } catch(e) {
      err.textContent = ATLAS.i18n.t('invalid_credentials');
      err.classList.remove('hidden');
    } finally {
      btn.disabled = false;
      document.getElementById('login-btn-text').textContent = ATLAS.i18n.t('login');
    }
  },

  async tryAutoLogin() {
    const token = localStorage.getItem('atlas_token');
    if (!token) return false;
    ATLAS.state.token = token;
    try {
      const user = await ATLAS.api.get('/api/auth/me');
      if (!user) return false;
      ATLAS.state.user = user;
      if (user.theme) ATLAS.ui.applyTheme(user.theme);
      if (user.language) { ATLAS.i18n.lang = user.language; localStorage.setItem('atlas_lang', user.language); }
      ATLAS.ws.connect();
      await ATLAS.boot();
      return true;
    } catch {
      localStorage.removeItem('atlas_token');
      return false;
    }
  },

  async doLogout() {
    try { await ATLAS.api.post('/api/auth/logout'); } catch {}
    ATLAS.ws.disconnect();
    ATLAS.state.token = null;
    ATLAS.state.user = null;
    localStorage.removeItem('atlas_token');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('app-shell').classList.add('hidden');
    document.getElementById('login-pass').value = '';
  }
},

/* ============================================================
   Boot
============================================================ */
async boot() {
  // Show app shell
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app-shell').classList.remove('hidden');

  // Load initial data in parallel
  const [modules, assets, incidents, alerts, sensors, rooms, info] = await Promise.all([
    ATLAS.api.get('/api/modules'),
    ATLAS.api.get('/api/assets'),
    ATLAS.api.get('/api/incidents'),
    ATLAS.api.get('/api/alerts'),
    ATLAS.api.get('/api/sensors'),
    ATLAS.api.get('/api/chat/rooms'),
    ATLAS.api.get('/api/info'),
  ]);

  ATLAS.state.modules = modules || [];
  ATLAS.state.assets = assets || [];
  ATLAS.state.incidents = incidents || [];
  ATLAS.state.alerts = alerts || [];
  ATLAS.state.sensors = sensors || [];
  ATLAS.state.chatRooms = rooms || [];

  // Update UI
  const u = ATLAS.state.user;
  document.getElementById('user-avatar').textContent = (u.full_name || u.username)[0].toUpperCase();
  document.getElementById('sidebar-user-name').textContent = u.full_name || u.username;
  document.getElementById('sidebar-user-role').textContent = ATLAS.i18n.t(u.role);
  if (info) {
    document.getElementById('sidebar-org-name').textContent = info.org || 'Atlas AdminSysOP';
  }

  ATLAS.ui.buildNav();
  ATLAS.alerts.updateBanner();
  ATLAS.ui.applyTranslations();
  ATLAS.i18n.setLang(ATLAS.i18n.lang);

  // Register service worker for push notifications
  ATLAS.audio.init();

  // Navigate to dashboard
  ATLAS.router.go('dashboard');

  // Handle hash routing
  window.addEventListener('hashchange', () => {
    const page = location.hash.replace('#/', '') || 'dashboard';
    ATLAS.router.go(page);
  });
},

/* ============================================================
   Router
============================================================ */
router: {
  go(page, force) {
    if (ATLAS.state.currentPage === page && !force) return;
    ATLAS.state.currentPage = page;
    location.hash = '#/' + page;

    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.page === page);
    });

    // Page title
    const titles = {
      dashboard: 'dashboard', map: 'map', incidents: 'incidents',
      alerts: 'alerts', chat: 'chat', sensors: 'sensors', logs: 'logs',
      analytics: 'analytics', fleet: 'fleet', navigation: 'navigation',
      users: 'users', modules: 'modules', settings: 'settings',
      pager: 'pager', scheduler: 'scheduler'
    };
    document.getElementById('page-title').textContent = ATLAS.i18n.t(titles[page] || page);

    // Render page
    const content = document.getElementById('main-content');
    content.innerHTML = '';

    switch(page) {
      case 'dashboard': ATLAS.dashboard.render(content); break;
      case 'map': ATLAS.map.render(content); break;
      case 'incidents': ATLAS.incidents.render(content); break;
      case 'alerts': ATLAS.alertsPage.render(content); break;
      case 'chat': ATLAS.chat.render(content); break;
      case 'sensors': ATLAS.sensors.render(content); break;
      case 'logs': ATLAS.logsPage.render(content); break;
      case 'analytics': ATLAS.analyticsPage.render(content); break;
      case 'fleet': ATLAS.fleet.render(content); break;
      case 'navigation': ATLAS.navigation.render(content); break;
      case 'users': ATLAS.usersPage.render(content); break;
      case 'modules': ATLAS.modulesPage.render(content); break;
      case 'settings': ATLAS.settingsPage.render(content); break;
      case 'pager': ATLAS.pagerPage.render(content); break;
      case 'scheduler': ATLAS.schedulerPage.render(content); break;
      case 'weather': ATLAS.weatherPage.render(content); break;
      case 'calendar': ATLAS.calendarPage.render(content); break;
      case 'travel': ATLAS.travelPage.render(content); break;
      default: content.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-muted);">Page not found: ${page}</div>`;
    }
  }
},

/* ============================================================
   UI Helpers
============================================================ */
ui: {
  buildNav() {
    const enabledModules = new Set(
      ATLAS.state.modules.filter(m => m.enabled).map(m => m.name)
    );
    const isAdmin = ATLAS.state.user?.role === 'admin';

    const nav = [
      { id: 'dashboard', icon: '📊', label: 'dashboard', always: true },
      { id: 'map', icon: '🗺', label: 'map', module: 'command_control' },
      { id: 'incidents', icon: '⚠️', label: 'incidents', module: 'command_control' },
      { id: 'alerts', icon: '🔔', label: 'alerts', module: 'alert_system' },
      { id: 'chat', icon: '💬', label: 'chat', module: 'communication' },
      { id: 'sensors', icon: '📡', label: 'sensors', module: 'hardware_sensors' },
      { id: 'logs', icon: '📋', label: 'logs', module: 'data_logging' },
      { id: 'analytics', icon: '🧠', label: 'analytics', module: 'ai_analytics' },
      { id: 'fleet', icon: '🚗', label: 'fleet', module: 'fleet_management' },
      { id: 'navigation', icon: '🧭', label: 'navigation', module: 'navigation' },
      { id: 'pager', icon: '📟', label: 'pager', module: 'pager' },
      { id: 'scheduler', icon: '🕐', label: 'scheduler', module: 'scheduler' },
      { id: 'weather', icon: '🌤', label: 'weather', module: 'weather' },
      { id: 'calendar', icon: '📅', label: 'calendar', module: 'calendar' },
      { id: 'travel', icon: '✈️', label: 'travel', module: 'travel' },
      { id: 'users', icon: '👥', label: 'users', module: 'user_management', adminOnly: true },
      { id: 'modules', icon: '🔧', label: 'modules', always: true, adminOnly: true },
      { id: 'settings', icon: '⚙️', label: 'settings', always: true },
    ];

    const menu = document.getElementById('nav-menu');
    menu.innerHTML = '';

    nav.forEach(item => {
      if (item.adminOnly && !isAdmin) return;
      if (item.module && !enabledModules.has(item.module)) return;
      const el = document.createElement('div');
      el.className = 'nav-item';
      el.dataset.page = item.id;
      el.innerHTML = `<span class="nav-icon">${item.icon}</span><span>${ATLAS.i18n.t(item.label)}</span>`;
      el.onclick = () => ATLAS.router.go(item.id);
      menu.appendChild(el);
    });
  },

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('atlas_theme', theme);
  },

  applyTranslations() {
    const t = ATLAS.i18n.t.bind(ATLAS.i18n);
    const el = id => document.getElementById(id);
    if (el('lbl-username')) el('lbl-username').textContent = t('username');
    if (el('lbl-password')) el('lbl-password').textContent = t('password');
    if (el('login-btn-text')) el('login-btn-text').textContent = t('login');
    if (el('login-hint')) el('login-hint').textContent = t('default_hint');
    if (el('sidebar-user-role') && ATLAS.state.user)
      el('sidebar-user-role').textContent = t(ATLAS.state.user.role);
    ATLAS.ui.buildNav();
    const cur = ATLAS.state.currentPage;
    if (el('page-title') && cur) el('page-title').textContent = t(cur);
  },

  updateOnlineCount() {
    const el = document.getElementById('online-count');
    if (el) el.textContent = ATLAS.state.onlineUsers.length || 1;
  },

  showThemePicker() {
    const themes = [
      { id: 'liquid-glass', name: 'Liquid Glass', colors: ['#1a1a2e','rgba(255,255,255,0.2)','#60a5fa'] },
      { id: 'cyberpunk', name: 'Cyberpunk', colors: ['#050508','#0d0d20','#00ff88'] },
      { id: 'glass', name: 'Glassmorphism', colors: ['#667eea','rgba(255,255,255,0.2)','#ffffff'] },
      { id: 'corporate', name: 'Corporate', colors: ['#f5f7fa','#ffffff','#1d4ed8'] },
      { id: 'military', name: 'Military', colors: ['#0a0f08','#161f12','#4a7c3f'] },
      { id: 'gold', name: 'Liquid Gold', colors: ['#0a0800','#1a1500','#ffd700'] },
      { id: 'arctic', name: 'Arctic White', colors: ['#f8fbff','#ffffff','#0ea5e9'] },
      { id: 'sunset', name: 'Sunset', colors: ['#1a0a00','#3d1a00','#ff6b35'] },
      { id: 'matrix', name: 'Matrix', colors: ['#000000','#001a00','#00ff41'] },
      { id: 'royal', name: 'Royal Purple', colors: ['#0d001a','#220044','#c084fc'] },
      { id: 'fire', name: 'Fire Red', colors: ['#0d0000','#220000','#ef4444'] },
    ];

    const current = document.documentElement.getAttribute('data-theme') || 'liquid-glass';
    const body = `
      <div class="theme-grid">
        ${themes.map(th => `
          <div class="theme-btn ${th.id === current ? 'active' : ''}"
               onclick="ATLAS.ui.applyTheme('${th.id}');ATLAS.ui.closeModal();ATLAS.api.put('/api/auth/me',{theme:'${th.id}'})">
            <div class="theme-preview" style="background:linear-gradient(135deg,${th.colors[0]},${th.colors[1]});border:2px solid ${th.colors[2]};"></div>
            <span style="font-size:11px;">${th.name}</span>
          </div>
        `).join('')}
      </div>`;
    ATLAS.ui.modal(ATLAS.i18n.t('theme'), body);
  },

  showUserMenu() {
    const u = ATLAS.state.user;
    const body = `
      <div class="form-group">
        <label class="form-label">${ATLAS.i18n.t('language')}</label>
        <div style="display:flex;gap:8px;">
          <button class="lang-btn ${ATLAS.i18n.lang==='en'?'active':''}" onclick="ATLAS.i18n.setLang('en');ATLAS.api.put('/api/auth/me',{language:'en'})">🇬🇧 English</button>
          <button class="lang-btn ${ATLAS.i18n.lang==='de'?'active':''}" onclick="ATLAS.i18n.setLang('de');ATLAS.api.put('/api/auth/me',{language:'de'})">🇩🇪 Deutsch</button>
          <button class="lang-btn ${ATLAS.i18n.lang==='fr'?'active':''}" onclick="ATLAS.i18n.setLang('fr');ATLAS.api.put('/api/auth/me',{language:'fr'})">🇫🇷 Français</button>
        </div>
      </div>
      <div class="divider"></div>
      <div class="form-group">
        <label class="form-label">${ATLAS.i18n.t('alert_tone')}</label>
        <select class="form-select" id="tone-select" onchange="ATLAS.api.put('/api/auth/me',{alert_tone:this.value})">
          ${ATLAS.audio.tones.map(t => `<option value="${t.id}" ${u.alert_tone===t.id?'selected':''}>${t.name}</option>`).join('')}
        </select>
        <button class="btn btn-secondary btn-sm mt-8" onclick="ATLAS.audio.test(document.getElementById('tone-select').value)">${ATLAS.i18n.t('test_tone')} ▶</button>
      </div>
      <div class="divider"></div>
      <button class="btn btn-danger w-full" onclick="ATLAS.auth.doLogout();ATLAS.ui.closeModal()">🚪 ${ATLAS.i18n.t('logout')}</button>
      <p style="font-size:10px;color:var(--text-muted);text-align:center;margin-top:16px;">${ATLAS.i18n.t('copyright')}</p>
    `;
    ATLAS.ui.modal(`${u.full_name || u.username} (${u.role})`, body);
  },

  modal(title, body, footer, size) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'active-modal';
    overlay.innerHTML = `
      <div class="modal ${size || ''}">
        <div class="modal-header">
          <div class="modal-title">${title}</div>
          <span class="modal-close" onclick="ATLAS.ui.closeModal()">✕</span>
        </div>
        <div class="modal-body">${body}</div>
        ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
      </div>`;
    overlay.addEventListener('click', e => { if (e.target === overlay) ATLAS.ui.closeModal(); });
    document.getElementById('modal-container').appendChild(overlay);
  },

  closeModal() {
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
  },

  openPanel(title, body) {
    document.getElementById('panel-title').textContent = title;
    document.getElementById('panel-body').innerHTML = body;
    document.getElementById('detail-panel').classList.add('open');
  },

  closePanel() {
    document.getElementById('detail-panel').classList.remove('open');
  },

  toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('mobile-open');
    document.getElementById('sidebar-overlay').classList.toggle('show');
  },

  closeSidebar() {
    document.getElementById('sidebar').classList.remove('mobile-open');
    document.getElementById('sidebar-overlay').classList.remove('show');
  },

  toast(msg, type, title) {
    const icons = { info: 'ℹ️', success: '✅', warning: '⚠️', critical: '🚨' };
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = `toast toast-${type || 'info'}`;
    el.innerHTML = `
      <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
      <div class="toast-body">
        ${title ? `<div class="toast-title">${title}</div>` : ''}
        <div class="toast-msg">${msg}</div>
      </div>
      <span class="toast-close" onclick="this.parentElement.remove()">✕</span>`;
    container.appendChild(el);
    el.onclick = () => el.classList.add('removing');
    setTimeout(() => { el.classList.add('removing'); setTimeout(() => el.remove(), 300); }, 5000);
  },

  formatDate(str) {
    if (!str) return '–';
    try { return new Date(str).toLocaleString(ATLAS.i18n.lang); } catch { return str; }
  },

  formatDateShort(str) {
    if (!str) return '–';
    try { return new Date(str).toLocaleDateString(ATLAS.i18n.lang); } catch { return str; }
  },

  severityBadge(sev) {
    const map = { critical: 'badge-danger', warning: 'badge-warning', info: 'badge-info' };
    return `<span class="badge ${map[sev] || 'badge-neutral'}">${ATLAS.i18n.t(sev)}</span>`;
  },

  statusBadge(status) {
    const map = { active: 'badge-success', available: 'badge-success', open: 'badge-danger',
                  in_progress: 'badge-warning', resolved: 'badge-neutral', on_trip: 'badge-info',
                  maintenance: 'badge-warning', out_of_service: 'badge-danger', standby: 'badge-neutral' };
    return `<span class="badge ${map[status] || 'badge-neutral'}">${ATLAS.i18n.t(status) || status}</span>`;
  },

  vehicleIcon(type) {
    const icons = { car: '🚗', van: '🚐', bus: '🚌', aircraft: '✈️', jet: '🛩️',
                    ship: '🚢', boat: '⛵', truck: '🚛', motorcycle: '🏍️',
                    helicopter: '🚁', drone: '🚁' };
    return icons[type] || '🚗';
  },

  assetIcon(type) {
    const icons = { vehicle: '🚗', person: '👤', facility: '🏢', drone: '🚁', sensor: '📡', boat: '⛵' };
    return icons[type] || '📍';
  }
},

/* ============================================================
   Alerts logic
============================================================ */
alerts: {
  onNew(alert) {
    ATLAS.alerts.updateBanner();
    ATLAS.ui.toast(alert.message, alert.severity, ATLAS.i18n.t(alert.severity));
    if (alert.severity === 'critical') {
      ATLAS.audio.startAlarm(ATLAS.state.user?.alert_tone || 'emergency_siren');
    } else if (alert.severity === 'warning') {
      ATLAS.audio.play(ATLAS.state.user?.alert_tone || 'emergency_siren');
    }
    // Update badge
    const unack = ATLAS.state.alerts.filter(a => !a.acknowledged).length;
    const badge = document.getElementById('notif-badge');
    if (badge) { badge.textContent = unack; badge.classList.toggle('hidden', unack === 0); }
  },

  onAck(id) {
    const a = ATLAS.state.alerts.find(a => a.id === id);
    if (a) a.acknowledged = 1;
    // Stop alarm if no more critical unacknowledged alerts
    const stillCritical = ATLAS.state.alerts.some(al => !al.acknowledged && al.severity === 'critical');
    if (!stillCritical) ATLAS.audio.stopAlarm();
    ATLAS.alerts.updateBanner();
  },

  updateBanner() {
    const critical = ATLAS.state.alerts.filter(a => !a.acknowledged && a.severity === 'critical');
    const banner = document.getElementById('alert-banner');
    const badge = document.getElementById('notif-badge');
    const notifBtn = document.getElementById('notif-btn');
    const unack = ATLAS.state.alerts.filter(a => !a.acknowledged).length;
    if (banner) {
      if (critical.length > 0) {
        banner.classList.remove('hidden');
        document.getElementById('alert-banner-text').textContent =
          `${critical.length} ${ATLAS.i18n.t('critical')} alert${critical.length > 1 ? 's' : ''} – ${critical[0].message}`;
      } else {
        banner.classList.add('hidden');
      }
    }
    if (badge) { badge.textContent = unack; badge.classList.toggle('hidden', unack === 0); }
  }
},

/* ============================================================
   Audio System – 20 synthesized tones
============================================================ */
audio: {
  tones: [
    { id: 'emergency_siren', name: '🚨 Emergency Siren' },
    { id: 'police_horn', name: '🚔 Police Horn' },
    { id: 'fire_alarm', name: '🔥 Fire Alarm' },
    { id: 'air_raid', name: '✈️ Air Raid' },
    { id: 'nuclear_alert', name: '☢️ Nuclear Alert' },
    { id: 'digital_beep', name: '📟 Digital Beep' },
    { id: 'combat_alert', name: '🎯 Combat Alert' },
    { id: 'submarine_dive', name: '🚢 Submarine Dive' },
    { id: 'radar_ping', name: '📡 Radar Ping' },
    { id: 'military_bugle', name: '🎺 Military Bugle' },
    { id: 'morse_sos', name: '📶 Morse SOS' },
    { id: 'klaxon', name: '📢 Klaxon' },
    { id: 'chime', name: '🔔 Chime' },
    { id: 'electronic_warning', name: '⚡ Electronic Warning' },
    { id: 'factory_horn', name: '🏭 Factory Horn' },
    { id: 'ships_bell', name: '⚓ Ship\'s Bell' },
    { id: 'thunder_crack', name: '⛈️ Thunder Crack' },
    { id: 'helicopter', name: '🚁 Helicopter' },
    { id: 'laser_alarm', name: '🔴 Laser Alarm' },
    { id: 'custom_tone', name: '🎛️ Custom Tone' },
  ],

  init() {
    // AudioContext created on user interaction
  },

  getCtx() {
    if (!ATLAS.state.audioCtx) {
      ATLAS.state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ATLAS.state.audioCtx.state === 'suspended') {
      ATLAS.state.audioCtx.resume();
    }
    return ATLAS.state.audioCtx;
  },

  _alarmInterval: null,
  _alarmToneId: null,

  test(toneId) {
    this.stopAlarm();
    this.play(toneId);
  },

  play(toneId) {
    try {
      const ctx = this.getCtx();
      const gain = ctx.createGain();
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.8, ctx.currentTime);
      this._playTone(ctx, gain, toneId);
    } catch(e) { console.warn('Audio play error:', e); }
  },

  startAlarm(toneId) {
    this.stopAlarm();
    this._alarmToneId = toneId;
    this.play(toneId);
    this._alarmInterval = setInterval(() => {
      if (this._alarmToneId) this.play(this._alarmToneId);
    }, 2500);
    // Show dismissible alarm overlay
    let overlay = document.getElementById('alarm-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'alarm-overlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99999;background:rgba(220,0,0,0.92);color:#fff;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;font-size:18px;font-weight:700;letter-spacing:1px;animation:pulse-bg 1s infinite;';
      overlay.innerHTML = `<span>🚨 ${ATLAS.i18n.t('alarm_active')}</span><button onclick="ATLAS.audio.stopAlarm()" style="background:#fff;color:#c00;border:none;padding:6px 18px;border-radius:6px;font-weight:700;cursor:pointer;">${ATLAS.i18n.t('dismiss_alarm')}</button>`;
      document.body.prepend(overlay);
    }
  },

  stopAlarm() {
    if (this._alarmInterval) { clearInterval(this._alarmInterval); this._alarmInterval = null; }
    this._alarmToneId = null;
    const overlay = document.getElementById('alarm-overlay');
    if (overlay) overlay.remove();
  },

  _playTone(ctx, gain, id) {
    const t = ctx.currentTime;
    const osc = () => { const o = ctx.createOscillator(); o.connect(gain); return o; };

    switch(id) {
      case 'emergency_siren': {
        const o = osc(); o.type = 'sawtooth';
        o.frequency.setValueAtTime(440, t);
        o.frequency.linearRampToValueAtTime(880, t+0.5);
        o.frequency.linearRampToValueAtTime(440, t+1);
        o.frequency.linearRampToValueAtTime(880, t+1.5);
        gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.7, t+0.05);
        gain.gain.setValueAtTime(0.7, t+1.45); gain.gain.linearRampToValueAtTime(0, t+1.6);
        o.start(t); o.stop(t+1.6); break;
      }
      case 'police_horn': {
        [0,0.5].forEach(d => {
          const o = osc(); o.type = 'square'; o.frequency.value = d===0?640:480;
          gain.gain.setValueAtTime(0,t+d); gain.gain.linearRampToValueAtTime(0.6,t+d+0.05);
          gain.gain.setValueAtTime(0.6,t+d+0.35); gain.gain.linearRampToValueAtTime(0,t+d+0.45);
          o.start(t+d); o.stop(t+d+0.45);
        }); break;
      }
      case 'fire_alarm': {
        for(let i=0;i<6;i++) {
          const o = osc(); o.type = 'square'; o.frequency.value = 880;
          gain.gain.setValueAtTime(0,t+i*0.2); gain.gain.linearRampToValueAtTime(0.7,t+i*0.2+0.02);
          gain.gain.setValueAtTime(0.7,t+i*0.2+0.08); gain.gain.linearRampToValueAtTime(0,t+i*0.2+0.1);
          o.start(t+i*0.2); o.stop(t+i*0.2+0.1);
        } break;
      }
      case 'air_raid': {
        const o = osc(); o.type = 'sawtooth';
        o.frequency.setValueAtTime(880, t);
        o.frequency.exponentialRampToValueAtTime(220, t+2);
        gain.gain.setValueAtTime(0,t); gain.gain.linearRampToValueAtTime(0.7,t+0.1);
        gain.gain.setValueAtTime(0.7,t+1.8); gain.gain.linearRampToValueAtTime(0,t+2);
        o.start(t); o.stop(t+2); break;
      }
      case 'nuclear_alert': {
        const o = osc(); o.type = 'sine'; o.frequency.value = 1000;
        gain.gain.setValueAtTime(0,t); gain.gain.linearRampToValueAtTime(0.9,t+0.1);
        gain.gain.setValueAtTime(0.9,t+1.5); gain.gain.linearRampToValueAtTime(0,t+2);
        o.start(t); o.stop(t+2); break;
      }
      case 'digital_beep': {
        [0,0.3,0.6].forEach(d => {
          const o = osc(); o.type = 'square'; o.frequency.value = 1200;
          gain.gain.setValueAtTime(0.6,t+d); gain.gain.setValueAtTime(0,t+d+0.15);
          o.start(t+d); o.stop(t+d+0.15);
        }); break;
      }
      case 'combat_alert': {
        [0,0.15,0.3,0.45,0.6].forEach(d => {
          const o = osc(); o.type = 'sawtooth'; o.frequency.value = d%0.3===0?800:600;
          gain.gain.setValueAtTime(0.6,t+d); gain.gain.setValueAtTime(0,t+d+0.1);
          o.start(t+d); o.stop(t+d+0.1);
        }); break;
      }
      case 'submarine_dive': {
        const o = osc(); o.type = 'sine';
        o.frequency.setValueAtTime(600, t);
        o.frequency.exponentialRampToValueAtTime(80, t+1.5);
        gain.gain.setValueAtTime(0.7,t); gain.gain.linearRampToValueAtTime(0,t+1.5);
        o.start(t); o.stop(t+1.5); break;
      }
      case 'radar_ping': {
        const o = osc(); o.type = 'sine'; o.frequency.value = 1500;
        gain.gain.setValueAtTime(0.5,t); gain.gain.exponentialRampToValueAtTime(0.001,t+0.6);
        o.start(t); o.stop(t+0.6); break;
      }
      case 'military_bugle': {
        const notes = [523,659,784,1047,784,659,523];
        notes.forEach((freq,i) => {
          const o = osc(); o.type = 'triangle'; o.frequency.value = freq;
          gain.gain.setValueAtTime(0.5,t+i*0.15); gain.gain.setValueAtTime(0,t+i*0.15+0.12);
          o.start(t+i*0.15); o.stop(t+i*0.15+0.12);
        }); break;
      }
      case 'morse_sos': {
        const pat=[0.1,0.1,0.1,0.3,0.3,0.3,0.1,0.1,0.1];
        let pos=t;
        pat.forEach(dur => {
          const o=osc(); o.type='sine'; o.frequency.value=700;
          gain.gain.setValueAtTime(0.6,pos); gain.gain.setValueAtTime(0,pos+dur*0.9);
          o.start(pos); o.stop(pos+dur);
          pos+=dur+0.05;
        }); break;
      }
      case 'klaxon': {
        const o = osc(); o.type = 'square';
        o.frequency.setValueAtTime(200, t);
        o.frequency.setValueAtTime(400, t+0.1);
        o.frequency.setValueAtTime(200, t+0.2);
        o.frequency.setValueAtTime(400, t+0.3);
        gain.gain.setValueAtTime(0.7,t); gain.gain.setValueAtTime(0,t+0.5);
        o.start(t); o.stop(t+0.5); break;
      }
      case 'chime': {
        [0,0.4,0.8].forEach((d,i) => {
          const o=osc(); o.type='sine'; o.frequency.value=[523,659,784][i];
          gain.gain.setValueAtTime(0.4,t+d); gain.gain.exponentialRampToValueAtTime(0.001,t+d+0.8);
          o.start(t+d); o.stop(t+d+0.8);
        }); break;
      }
      case 'electronic_warning': {
        const o = osc(); o.type = 'sawtooth';
        [0,0.2,0.4,0.6].forEach(d => o.frequency.setValueAtTime(d%0.4===0?400:600, t+d));
        gain.gain.setValueAtTime(0.5,t); gain.gain.setValueAtTime(0,t+0.8);
        o.start(t); o.stop(t+0.8); break;
      }
      case 'factory_horn': {
        const o = osc(); o.type = 'sawtooth'; o.frequency.value = 150;
        gain.gain.setValueAtTime(0,t); gain.gain.linearRampToValueAtTime(0.8,t+0.1);
        gain.gain.setValueAtTime(0.8,t+0.8); gain.gain.linearRampToValueAtTime(0,t+1);
        o.start(t); o.stop(t+1); break;
      }
      case 'ships_bell': {
        [0,0.6].forEach(d => {
          const o=osc(); o.type='sine'; o.frequency.value=830;
          gain.gain.setValueAtTime(0.5,t+d); gain.gain.exponentialRampToValueAtTime(0.001,t+d+0.5);
          o.start(t+d); o.stop(t+d+0.5);
        }); break;
      }
      case 'thunder_crack': {
        const buf=ctx.createBuffer(1,ctx.sampleRate*0.5,ctx.sampleRate);
        const data=buf.getChannelData(0);
        for(let i=0;i<data.length;i++) data[i]=(Math.random()*2-1)*Math.exp(-i/10000);
        const src=ctx.createBufferSource(); src.buffer=buf;
        src.connect(gain); gain.gain.value=0.8;
        src.start(t); break;
      }
      case 'helicopter': {
        const o=osc(); o.type='sawtooth'; o.frequency.value=12;
        const mod=ctx.createGain(); mod.gain.value=400;
        const car=osc(); car.type='sine'; car.frequency.value=200;
        o.connect(mod); mod.connect(car.frequency); car.connect(gain);
        gain.gain.setValueAtTime(0.5,t); gain.gain.setValueAtTime(0,t+1.5);
        o.start(t); car.start(t); o.stop(t+1.5); car.stop(t+1.5); break;
      }
      case 'laser_alarm': {
        const o=osc(); o.type='sine';
        o.frequency.setValueAtTime(2000,t); o.frequency.exponentialRampToValueAtTime(200,t+0.2);
        o.frequency.exponentialRampToValueAtTime(2000,t+0.4); o.frequency.exponentialRampToValueAtTime(200,t+0.6);
        gain.gain.setValueAtTime(0.6,t); gain.gain.setValueAtTime(0,t+0.65);
        o.start(t); o.stop(t+0.65); break;
      }
      default: { // custom_tone
        const o=osc(); o.type='sine'; o.frequency.value=440;
        gain.gain.setValueAtTime(0.5,t); gain.gain.linearRampToValueAtTime(0,t+0.5);
        o.start(t); o.stop(t+0.5);
      }
    }
  }
},

/* ============================================================
   Init
============================================================ */
async init() {
  // Apply saved theme
  const savedTheme = localStorage.getItem('atlas_theme') || 'liquid-glass';
  ATLAS.ui.applyTheme(savedTheme);

  // Apply saved language
  const savedLang = localStorage.getItem('atlas_lang') || 'en';
  ATLAS.i18n.lang = savedLang;

  // Try auto-login
  const ok = await ATLAS.auth.tryAutoLogin();
  if (!ok) {
    document.getElementById('login-screen').classList.remove('hidden');
    ATLAS.ui.applyTranslations();
  }

  // Enter key on password field
  document.getElementById('login-pass').addEventListener('keydown', e => {
    if (e.key === 'Enter') ATLAS.auth.login();
  });
}

}; // end ATLAS

/* ============================================================
   Dashboard Page
============================================================ */
ATLAS.dashboard = {
  charts: {},
  _kpiPrev: {},
  _wsRegistered: false,

  async render(el) {
    const kpiDefs = [
      { k: 'active_assets',   icon: '🎯', color: 'var(--accent)',   label: 'Active Assets' },
      { k: 'open_incidents',  icon: '⚠️',  color: 'var(--danger)',  label: 'Open Incidents' },
      { k: 'active_alerts',   icon: '🔔', color: 'var(--warning)',  label: 'Active Alerts' },
      { k: 'online_users',    icon: '👥', color: 'var(--success)',  label: 'Online Users' },
      { k: 'fleet_available', icon: '🚗', color: 'var(--info)',     label: 'Fleet Available' },
      { k: 'fleet_on_trip',   icon: '🛣️',  color: 'var(--accent)',  label: 'On Trip' },
    ];
    el.innerHTML = `
      <div class="kpi-grid" id="kpi-grid">
        ${kpiDefs.map(d => `
          <div class="kpi-card" style="cursor:default;" data-kpi="${d.k}">
            <div class="kpi-label">${d.label.toUpperCase()}</div>
            <div class="kpi-value kpi-animated" id="kpi-${d.k}" style="color:${d.color};">–</div>
            <div class="kpi-icon">${d.icon}</div>
            <div class="kpi-delta hidden" id="kpi-delta-${d.k}" style="font-size:11px;margin-top:2px;"></div>
          </div>`).join('')}
      </div>
      <div class="grid-2" style="margin-bottom:20px;">
        <div class="card">
          <div class="card-title">📈 Incident Trend <span style="font-size:11px;font-weight:400;color:var(--text-muted);">24h</span></div>
          <div class="chart-wrapper"><canvas id="chart-incidents"></canvas></div>
        </div>
        <div class="card">
          <div class="card-title">🔔 Alert Activity <span style="font-size:11px;font-weight:400;color:var(--text-muted);">12h</span></div>
          <div class="chart-wrapper"><canvas id="chart-alerts"></canvas></div>
        </div>
      </div>
      <div class="grid-2" style="margin-bottom:20px;">
        <div class="card">
          <div class="card-title">🗺 Asset Distribution</div>
          <div class="chart-wrapper"><canvas id="chart-assets"></canvas></div>
        </div>
        <div class="card">
          <div class="card-title">📡 Sensor Overview <span style="font-size:11px;font-weight:400;color:var(--text-muted);">6h</span></div>
          <div class="chart-wrapper"><canvas id="chart-sensors"></canvas></div>
        </div>
      </div>
      <div class="card">
        <div class="card-title">⚡ Recent Activity</div>
        <div id="activity-feed" style="display:flex;flex-direction:column;gap:6px;max-height:220px;overflow-y:auto;">
          <div style="color:var(--text-muted);text-align:center;padding:20px;">${ATLAS.i18n.t('loading')}</div>
        </div>
      </div>`;
    await this.loadKPIs();
    await this.loadCharts();
    await this.loadActivityFeed();
    if (!this._wsRegistered) {
      this._wsRegistered = true;
      ATLAS.ws.on('alert_new', () => { this.loadKPIs(); this.addActivityItem('🔔', 'New alert received', 'warning'); });
      ATLAS.ws.on('incident_new', d => { this.loadKPIs(); this.addActivityItem('⚠️', `Incident: ${d.title||'New incident'}`, 'info'); });
      ATLAS.ws.on('asset_new', d => this.addActivityItem('📍', `Asset added: ${d.name}`, 'info'));
    }
  },

  async loadKPIs() {
    const kpis = await ATLAS.api.get('/api/analytics/kpis');
    if (!kpis) return;
    Object.entries(kpis).forEach(([k,v]) => {
      const el = document.getElementById('kpi-'+k);
      const deltaEl = document.getElementById('kpi-delta-'+k);
      if (el) {
        const prev = this._kpiPrev[k];
        const num = typeof v === 'number' ? v : parseInt(v)||0;
        el.textContent = typeof v === 'string' && v.startsWith('€') ? v : num.toLocaleString();
        if (prev !== undefined && deltaEl) {
          const diff = num - prev;
          if (diff !== 0) {
            deltaEl.textContent = (diff > 0 ? '▲ +' : '▼ ') + diff;
            deltaEl.style.color = diff > 0 ? 'var(--danger)' : 'var(--success)';
            deltaEl.classList.remove('hidden');
          }
        }
        this._kpiPrev[k] = num;
        // Animate
        el.classList.remove('kpi-animated');
        void el.offsetWidth;
        el.classList.add('kpi-animated');
      }
    });
  },

  async loadActivityFeed() {
    const logs = await ATLAS.api.get('/api/audit?limit=8') || [];
    const feed = document.getElementById('activity-feed');
    if (!feed) return;
    const icons = { login: '🔑', logout: '🚪', create_incident: '⚠️', create_alert: '🔔', ack_alert: '✅', create_asset: '📍', toggle_module: '🔧' };
    if (!logs.length) { feed.innerHTML = `<div style="color:var(--text-muted);text-align:center;padding:16px;">${ATLAS.i18n.t('no_data')}</div>`; return; }
    feed.innerHTML = logs.map(l => {
      const ago = this.timeAgo(l.timestamp);
      return `<div style="display:flex;align-items:center;gap:10px;padding:8px;border-radius:var(--radius-sm);background:var(--bg-secondary);">
        <span style="font-size:16px;flex-shrink:0;">${icons[l.action]||'📋'}</span>
        <div style="flex:1;min-width:0;">
          <div style="font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${l.action.replace(/_/g,' ')}</div>
          <div style="font-size:11px;color:var(--text-muted);">${l.username||'system'} · ${ago}</div>
        </div>
      </div>`;
    }).join('');
  },

  addActivityItem(icon, text, type) {
    const feed = document.getElementById('activity-feed');
    if (!feed) return;
    const el = document.createElement('div');
    el.style.cssText = 'display:flex;align-items:center;gap:10px;padding:8px;border-radius:var(--radius-sm);background:var(--bg-secondary);animation:fadeInDown 0.3s ease;';
    el.innerHTML = `<span style="font-size:16px;">${icon}</span><div style="flex:1;font-size:12px;font-weight:600;">${text}</div><div style="font-size:11px;color:var(--text-muted);">just now</div>`;
    feed.insertBefore(el, feed.firstChild);
    if (feed.children.length > 10) feed.removeChild(feed.lastChild);
  },

  timeAgo(ts) {
    const diff = Date.now() - new Date(ts).getTime();
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return Math.floor(diff/60000) + 'm ago';
    if (diff < 86400000) return Math.floor(diff/3600000) + 'h ago';
    return Math.floor(diff/86400000) + 'd ago';
  },

  async loadCharts() {
    if (typeof Chart === 'undefined') return;
    const css = k => getComputedStyle(document.documentElement).getPropertyValue(k).trim();
    Chart.defaults.color = css('--text-secondary') || '#aaa';
    const accent = css('--accent') || '#60a5fa';
    const danger = css('--danger') || '#f87171';
    const warning = css('--warning') || '#fbbf24';
    const success = css('--success') || '#34d399';
    const gridColor = 'rgba(128,128,128,0.08)';
    const axisColor = css('--text-muted') || '#666';

    const trends = await ATLAS.api.get('/api/analytics/trends?hours=24');
    if (!trends) return;

    const chartOpts = (extra={}) => ({
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
      scales: {
        x: { ticks: { maxTicksLimit: 8, color: axisColor, font: { size: 10 } }, grid: { color: gridColor } },
        y: { beginAtZero: true, ticks: { color: axisColor, font: { size: 10 } }, grid: { color: gridColor } }
      },
      ...extra
    });

    // Incident trend
    const incData = (trends.open_incidents || []).slice(-24);
    const incLabels = incData.map(d => new Date(d.timestamp).toLocaleTimeString(ATLAS.i18n.lang, {hour:'2-digit',minute:'2-digit'}));
    const incVals = incData.map(d => d.value);
    if (this.charts.incidents) this.charts.incidents.destroy();
    const ctx1 = document.getElementById('chart-incidents');
    if (ctx1) this.charts.incidents = new Chart(ctx1, {
      type: 'line',
      data: { labels: incLabels, datasets: [{ label: 'Open Incidents', data: incVals, borderColor: danger, backgroundColor: danger+'22', tension: 0.4, fill: true, pointRadius: 2, pointHoverRadius: 4 }] },
      options: chartOpts()
    });

    // Alerts bar
    const alData = (trends.active_alerts || []).slice(-12);
    const alLabels = alData.map(d => new Date(d.timestamp).toLocaleTimeString(ATLAS.i18n.lang, {hour:'2-digit',minute:'2-digit'}));
    const alVals = alData.map(d => d.value);
    if (this.charts.alerts) this.charts.alerts.destroy();
    const ctx2 = document.getElementById('chart-alerts');
    if (ctx2) this.charts.alerts = new Chart(ctx2, {
      type: 'bar',
      data: { labels: alLabels, datasets: [{ label: 'Active Alerts', data: alVals, backgroundColor: warning+'99', borderColor: warning, borderWidth: 1, borderRadius: 3 }] },
      options: chartOpts({ scales: { x: { ticks: { maxTicksLimit: 8, color: axisColor, font: { size: 10 } }, grid: { display: false } }, y: { beginAtZero: true, ticks: { color: axisColor, font: { size: 10 } }, grid: { color: gridColor } } } })
    });

    // Asset doughnut
    const byStatus = {};
    ATLAS.state.assets.forEach(a => { byStatus[a.status] = (byStatus[a.status]||0)+1; });
    if (this.charts.assets) this.charts.assets.destroy();
    const ctx3 = document.getElementById('chart-assets');
    if (ctx3) this.charts.assets = new Chart(ctx3, {
      type: 'doughnut',
      data: { labels: Object.keys(byStatus), datasets: [{ data: Object.values(byStatus), backgroundColor: [accent+'cc', warning+'cc', danger+'cc', success+'cc', '#888cc'], borderWidth: 0 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: axisColor, font: { size: 11 }, padding: 12, usePointStyle: true } }, tooltip: { mode: 'index' } }, cutout: '65%' }
    });

    // Sensor line
    const sensors = ATLAS.state.sensors.slice(0,3);
    const sColors = [accent, warning, danger];
    const ctx4 = document.getElementById('chart-sensors');
    if (ctx4 && sensors.length > 0) {
      const histories = await Promise.all(sensors.map(s => ATLAS.api.get(`/api/sensors/${s.id}/history?hours=6`)));
      const sLabels = (histories[0]||[]).slice(-30).map(r => new Date(r.timestamp).toLocaleTimeString(ATLAS.i18n.lang, {hour:'2-digit',minute:'2-digit'}));
      if (this.charts.sensors) this.charts.sensors.destroy();
      this.charts.sensors = new Chart(ctx4, {
        type: 'line',
        data: { labels: sLabels, datasets: sensors.map((s,i) => ({ label: s.name, data: (histories[i]||[]).slice(-30).map(r => r.value), borderColor: sColors[i], backgroundColor: 'transparent', tension: 0.4, pointRadius: 0, pointHoverRadius: 3, borderWidth: 2 })) },
        options: chartOpts({ plugins: { legend: { display: true, position: 'bottom', labels: { color: axisColor, font: { size: 11 }, usePointStyle: true } }, tooltip: { mode: 'index', intersect: false } } })
      });
    }
  }
};


/* ============================================================
   Map Page (Command & Control)
============================================================ */
// Shared tile layer definitions used by Map, Navigation, and Fleet map
ATLAS._tileLayers = {
  osm:       { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attr: '© OpenStreetMap contributors' },
  satellite: { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attr: '© Esri, Maxar, GeoEye' },
  topo:      { url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', attr: '© OpenTopoMap' },
  dark:      { url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', attr: '© CARTO' },
  transport: { url: 'https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=', attr: '© Thunderforest' },
  water:     { url: 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', attr: '© OpenSeaMap' },
};
ATLAS._createTileLayer = function(layerId) {
  const def = ATLAS._tileLayers[layerId] || ATLAS._tileLayers.osm;
  return L.tileLayer(def.url, { attribution: def.attr, maxZoom: 19 });
};
ATLAS._switchTileLayer = function(mapInstance, newLayerId, currentLayerRef) {
  if (currentLayerRef.layer) mapInstance.removeLayer(currentLayerRef.layer);
  currentLayerRef.layer = ATLAS._createTileLayer(newLayerId);
  currentLayerRef.layer.addTo(mapInstance);
  return currentLayerRef;
};

ATLAS.map = {
  instance: null,
  markers: {},
  incidentMarkers: {},
  fleetLayer: null,
  _tileLayerRef: { layer: null },
  _currentLayer: 'osm',

  render(el) {
    const t = k => ATLAS.i18n.t(k);
    el.innerHTML = `
      <div class="page-header">
        <h1>${t('map')}</h1>
        <div class="actions">
          <select class="form-select" style="width:auto;padding:4px 8px;font-size:13px;" onchange="ATLAS.map.switchLayer(this.value)" title="${t('map_layer')}">
            <option value="osm">${t('map_osm')}</option>
            <option value="satellite">${t('map_satellite')}</option>
            <option value="topo">${t('map_topo')}</option>
            <option value="dark">${t('map_dark')}</option>
            <option value="water">⚓ ${t('map_water')}</option>
          </select>
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.map.toggleFleetLayer()">🚗 Fleet Layer</button>
          <button class="btn btn-primary btn-sm" onclick="ATLAS.incidents.showCreate()">+ ${t('new_incident')}</button>
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.map.showAddAsset()">+ ${t('new_asset')}</button>
        </div>
      </div>
      <div class="grid-2" style="margin-bottom:16px;">
        ${[['active_assets','🎯','–'],['open_incidents','⚠️','–'],['active_alerts','🔔','–']].map(([k,icon,v])=>`
          <div class="kpi-card" style="padding:12px 16px;">
            <div class="kpi-label">${k.replace(/_/g,' ').toUpperCase()}</div>
            <div class="kpi-value" id="map-kpi-${k}" style="font-size:24px;">–</div>
            <div class="kpi-icon">${icon}</div>
          </div>`).join('')}
        <div class="kpi-card" style="padding:12px 16px;">
          <div class="kpi-label">ASSETS</div>
          <div class="kpi-value" style="font-size:24px;">${ATLAS.state.assets.length}</div>
          <div class="kpi-icon">📍</div>
        </div>
      </div>
      <div class="card" style="padding:0;overflow:hidden;">
        <div id="main-map" style="height:520px;"></div>
      </div>
      <div class="grid-2" style="margin-top:16px;">
        <div class="card">
          <div class="card-title">📍 Assets</div>
          <div class="list-scroll" id="asset-list-sidebar"></div>
        </div>
        <div class="card">
          <div class="card-title">⚠️ Active Incidents</div>
          <div class="list-scroll" id="incident-list-sidebar"></div>
        </div>
      </div>`;

    setTimeout(() => this.initMap(), 50);
    this.loadMapKPIs();
  },

  async loadMapKPIs() {
    const kpis = await ATLAS.api.get('/api/analytics/kpis');
    if (!kpis) return;
    ['active_assets','open_incidents','active_alerts'].forEach(k => {
      const el = document.getElementById('map-kpi-'+k);
      if (el) el.textContent = kpis[k] ?? '–';
    });
  },

  initMap() {
    if (!window.L) { setTimeout(() => this.initMap(), 200); return; }
    const mapEl = document.getElementById('main-map');
    if (!mapEl) return;
    // If instance exists but container was re-created (page reload), destroy old map
    if (this.instance) {
      if (mapEl._leaflet_id) { this.instance.invalidateSize(); return; }
      try { this.instance.remove(); } catch(e) {}
      this.instance = null;
      this.markers = {};
    }

    this.instance = L.map('main-map').setView([51.1657, 10.4515], 6);
    this._tileLayerRef.layer = ATLAS._createTileLayer(this._currentLayer);
    this._tileLayerRef.layer.addTo(this.instance);

    ATLAS.state.assets = ATLAS.state.assets || [];
    ATLAS.state.assets.forEach(a => this.addAssetMarker(a));
    ATLAS.state.incidents.filter(i => i.lat && i.lng && i.status !== 'resolved').forEach(i => this.addIncidentMarker(i));

    this.renderAssetList();
    this.renderIncidentList();
    ATLAS.state.mapInstance = this.instance;
  },

  addAssetMarker(asset) {
    if (!this.instance || !asset.lat || !asset.lng) return;
    const icon = L.divIcon({
      html: `<div style="background:var(--accent);border:2px solid white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.4);">${ATLAS.ui.assetIcon(asset.type)}</div>`,
      iconSize: [28,28], iconAnchor: [14,14], className: ''
    });
    const marker = L.marker([asset.lat, asset.lng], { icon })
      .addTo(this.instance)
      .bindPopup(`<b>${asset.name}</b><br>${ATLAS.ui.assetIcon(asset.type)} ${asset.type}<br><span style="color:${asset.status==='active'?'green':'orange'}">${asset.status}</span>`);
    marker.on('click', () => ATLAS.map.showAssetDetail(asset));
    this.markers[asset.id] = marker;
  },

  addIncidentMarker(incident) {
    if (!this.instance || !incident.lat || !incident.lng) return;
    const colors = { critical: '#ef4444', warning: '#fbbf24', info: '#60a5fa' };
    const icon = L.divIcon({
      html: `<div style="background:${colors[incident.severity]||'#fbbf24'};border:2px solid white;border-radius:4px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:12px;box-shadow:0 2px 6px rgba(0,0,0,0.5);">⚠</div>`,
      iconSize: [24,24], iconAnchor: [12,12], className: ''
    });
    L.marker([incident.lat, incident.lng], { icon })
      .addTo(this.instance)
      .bindPopup(`<b>${incident.title}</b><br>${incident.severity} – ${incident.status}`);
    this.incidentMarkers[incident.id] = true;
  },

  moveMarker(id, lat, lng) {
    if (this.markers[id]) this.markers[id].setLatLng([lat, lng]);
  },

  switchLayer(layerId) {
    this._currentLayer = layerId;
    if (!this.instance) return;
    if (layerId === 'water') {
      // Water/seamark is a transparent overlay — use OSM as base + seamark on top
      ATLAS._switchTileLayer(this.instance, 'osm', this._tileLayerRef);
      if (this._waterOverlay) { try { this.instance.removeLayer(this._waterOverlay); } catch(e) {} }
      this._waterOverlay = ATLAS._createTileLayer('water');
      this._waterOverlay.addTo(this.instance);
    } else {
      if (this._waterOverlay) {
        try { this.instance.removeLayer(this._waterOverlay); } catch(e) {}
        this._waterOverlay = null;
      }
      ATLAS._switchTileLayer(this.instance, layerId, this._tileLayerRef);
    }
  },

  toggleFleetLayer() {
    if (!this.instance) return;
    if (this.fleetLayer) {
      this.fleetLayer.clearLayers();
      this.fleetLayer = null;
      ATLAS.ui.toast('Fleet layer hidden', 'info');
      return;
    }
    this.fleetLayer = L.layerGroup().addTo(this.instance);
    ATLAS.api.get('/api/fleet/vehicles').then(vehicles => {
      if (!vehicles) return;
      vehicles.forEach(v => {
        if (!v.lat || !v.lng) return;
        const icon = L.divIcon({
          html: `<div style="background:#8b5cf6;border:2px solid white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:13px;box-shadow:0 2px 8px rgba(0,0,0,0.4);">${ATLAS.ui.vehicleIcon(v.type)}</div>`,
          iconSize: [28,28], iconAnchor: [14,14], className: ''
        });
        L.marker([v.lat, v.lng], { icon }).addTo(this.fleetLayer)
          .bindPopup(`<b>${v.name}</b><br>${v.make} ${v.model}<br>${v.status}`);
        ATLAS.state.fleetMapMarkers = ATLAS.state.fleetMapMarkers || {};
        ATLAS.state.fleetMapMarkers[v.id] = null;
      });
    });
  },

  renderAssetList() {
    const el = document.getElementById('asset-list-sidebar');
    if (!el) return;
    el.innerHTML = ATLAS.state.assets.map(a => `
      <div style="display:flex;align-items:center;gap:10px;padding:8px;border-radius:var(--radius-sm);cursor:pointer;transition:background 0.2s;" onmouseover="this.style.background='var(--nav-hover-bg)'" onmouseout="this.style.background=''" onclick="ATLAS.map.flyTo(${a.lat},${a.lng})">
        <span style="font-size:20px;">${ATLAS.ui.assetIcon(a.type)}</span>
        <div style="flex:1;min-width:0;"><div style="font-size:13px;font-weight:600;">${a.name}</div><div style="font-size:11px;color:var(--text-muted);">${a.type}</div></div>
        ${ATLAS.ui.statusBadge(a.status)}
      </div>`).join('') || `<div style="color:var(--text-muted);padding:12px;text-align:center;">${ATLAS.i18n.t('no_data')}</div>`;
  },

  renderIncidentList() {
    const el = document.getElementById('incident-list-sidebar');
    if (!el) return;
    const open = ATLAS.state.incidents.filter(i => i.status !== 'resolved');
    el.innerHTML = open.map(i => `
      <div style="display:flex;align-items:center;gap:10px;padding:8px;border-radius:var(--radius-sm);cursor:pointer;" onmouseover="this.style.background='var(--nav-hover-bg)'" onmouseout="this.style.background=''" onclick="ATLAS.map.flyTo(${i.lat||51.16},${i.lng||10.45})">
        <span>${ATLAS.ui.severityBadge(i.severity)}</span>
        <div style="flex:1;min-width:0;"><div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${i.title}</div><div style="font-size:11px;color:var(--text-muted);">${ATLAS.ui.formatDate(i.created_at)}</div></div>
      </div>`).join('') || `<div style="color:var(--text-muted);padding:12px;text-align:center;">No open incidents</div>`;
  },

  flyTo(lat, lng) {
    if (this.instance && lat && lng) this.instance.flyTo([lat, lng], 13, { duration: 1.5 });
  },

  showAssetDetail(asset) {
    ATLAS.ui.openPanel(asset.name, `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
        <span style="font-size:36px;">${ATLAS.ui.assetIcon(asset.type)}</span>
        <div><div style="font-size:18px;font-weight:700;">${asset.name}</div><div style="color:var(--text-muted);">${asset.type}</div></div>
      </div>
      ${ATLAS.ui.statusBadge(asset.status)}
      <div class="divider"></div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div style="display:flex;justify-content:space-between;font-size:13px;"><span style="color:var(--text-muted);">Lat</span><span>${asset.lat?.toFixed(4)||'–'}</span></div>
        <div style="display:flex;justify-content:space-between;font-size:13px;"><span style="color:var(--text-muted);">Lng</span><span>${asset.lng?.toFixed(4)||'–'}</span></div>
        <div style="display:flex;justify-content:space-between;font-size:13px;"><span style="color:var(--text-muted);">Updated</span><span>${ATLAS.ui.formatDate(asset.updated_at)}</span></div>
        ${asset.description?`<div style="font-size:13px;color:var(--text-secondary);margin-top:8px;">${asset.description}</div>`:''}
      </div>
    `);
  },

  showAddAsset() {
    ATLAS.ui.modal(ATLAS.i18n.t('new_asset'), `
      <div class="form-group"><label class="form-label">${ATLAS.i18n.t('name')}</label><input id="na-name" class="form-input" placeholder="Asset name"></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('type')}</label>
          <select id="na-type" class="form-select"><option value="vehicle">Vehicle</option><option value="person">Person</option><option value="facility">Facility</option><option value="drone">Drone</option><option value="sensor">Sensor</option></select>
        </div>
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('status')}</label>
          <select id="na-status" class="form-select"><option value="active">Active</option><option value="standby">Standby</option><option value="inactive">Inactive</option></select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Latitude</label><input id="na-lat" class="form-input" type="number" step="any" placeholder="51.1657"></div>
        <div class="form-group"><label class="form-label">Longitude</label><input id="na-lng" class="form-input" type="number" step="any" placeholder="10.4515"></div>
      </div>
      <div class="form-group"><label class="form-label">${ATLAS.i18n.t('description')}</label><textarea id="na-desc" class="form-textarea"></textarea></div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.map.createAsset()">+ ${ATLAS.i18n.t('create')}</button>`
    );
  },

  async createAsset() {
    const name = document.getElementById('na-name').value.trim();
    if (!name) return;
    const asset = await ATLAS.api.post('/api/assets', {
      name, type: document.getElementById('na-type').value,
      status: document.getElementById('na-status').value,
      lat: parseFloat(document.getElementById('na-lat').value)||null,
      lng: parseFloat(document.getElementById('na-lng').value)||null,
      description: document.getElementById('na-desc').value
    });
    ATLAS.ui.closeModal();
    ATLAS.ui.toast(`Asset "${name}" created`, 'success');
    ATLAS.map.renderAssetList();
  }
};


/* ============================================================
   Incidents Page
============================================================ */
ATLAS.incidents = {
  _all: [],
  _wsRegistered: false,

  async render(el) {
    const incidents = await ATLAS.api.get('/api/incidents') || [];
    ATLAS.state.incidents = incidents;
    this._all = incidents;

    const openCount = incidents.filter(i => i.status === 'open').length;
    const critCount = incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved').length;

    el.innerHTML = `
      <div class="page-header">
        <h1>${ATLAS.i18n.t('incidents')}</h1>
        <div class="actions">
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.incidents.exportCSV()">⬇ CSV</button>
          <button class="btn btn-primary" onclick="ATLAS.incidents.showCreate()">+ ${ATLAS.i18n.t('new_incident')}</button>
        </div>
      </div>
      <div class="kpi-grid" style="margin-bottom:16px;">
        <div class="kpi-card" style="padding:12px 16px;cursor:pointer;" onclick="document.getElementById('inc-filter-status').value='open';ATLAS.incidents.filter()">
          <div class="kpi-label">OPEN</div><div class="kpi-value" style="font-size:22px;color:var(--danger);">${openCount}</div><div class="kpi-icon">🔓</div>
        </div>
        <div class="kpi-card" style="padding:12px 16px;cursor:pointer;" onclick="document.getElementById('inc-filter-status').value='in_progress';ATLAS.incidents.filter()">
          <div class="kpi-label">IN PROGRESS</div><div class="kpi-value" style="font-size:22px;color:var(--warning);">${incidents.filter(i=>i.status==='in_progress').length}</div><div class="kpi-icon">🔄</div>
        </div>
        <div class="kpi-card" style="padding:12px 16px;cursor:pointer;" onclick="document.getElementById('inc-filter-sev').value='critical';ATLAS.incidents.filter()">
          <div class="kpi-label">CRITICAL</div><div class="kpi-value" style="font-size:22px;color:var(--danger);">${critCount}</div><div class="kpi-icon">🚨</div>
        </div>
        <div class="kpi-card" style="padding:12px 16px;cursor:pointer;" onclick="document.getElementById('inc-filter-status').value='resolved';ATLAS.incidents.filter()">
          <div class="kpi-label">RESOLVED</div><div class="kpi-value" style="font-size:22px;color:var(--success);">${incidents.filter(i=>i.status==='resolved').length}</div><div class="kpi-icon">✅</div>
        </div>
      </div>
      <div class="card">
        <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;align-items:center;">
          <input id="inc-search" class="form-input" style="flex:1;min-width:200px;" placeholder="${ATLAS.i18n.t('search')}..." oninput="ATLAS.incidents.filter()">
          <select id="inc-filter-status" class="form-select" style="width:150px;" onchange="ATLAS.incidents.filter()">
            <option value="">All Status</option><option value="open">Open</option><option value="in_progress">In Progress</option><option value="resolved">Resolved</option>
          </select>
          <select id="inc-filter-sev" class="form-select" style="width:150px;" onchange="ATLAS.incidents.filter()">
            <option value="">All Severity</option><option value="critical">Critical</option><option value="warning">Warning</option><option value="info">Info</option>
          </select>
          <button class="btn btn-secondary btn-sm" onclick="document.getElementById('inc-search').value='';document.getElementById('inc-filter-status').value='';document.getElementById('inc-filter-sev').value='';ATLAS.incidents.filter()">✕ Clear</button>
        </div>
        <div id="inc-count" style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">${incidents.length} incident${incidents.length!==1?'s':''}</div>
        <div class="table-wrap">
          <table>
            <thead><tr>
              <th>${ATLAS.i18n.t('severity')}</th>
              <th>${ATLAS.i18n.t('title')}</th>
              <th>${ATLAS.i18n.t('status')}</th>
              <th>${ATLAS.i18n.t('date')}</th>
              <th style="text-align:right;">Actions</th>
            </tr></thead>
            <tbody id="incident-tbody"></tbody>
          </table>
        </div>
      </div>`;
    this.renderTable(incidents);
    if (!this._wsRegistered) {
      this._wsRegistered = true;
      ATLAS.ws.on('incident_new', inc => {
        this._all.unshift(inc);
        ATLAS.state.incidents.unshift(inc);
        this.filter();
      });
    }
  },

  renderTable(list) {
    const tbody = document.getElementById('incident-tbody');
    const countEl = document.getElementById('inc-count');
    if (countEl) countEl.textContent = `${list.length} incident${list.length!==1?'s':''}`;
    if (!tbody) return;
    tbody.innerHTML = list.map(i => `
      <tr style="cursor:pointer;" onclick="ATLAS.incidents.showDetail(${JSON.stringify(i).replace(/"/g,'&quot;')})">
        <td>${ATLAS.ui.severityBadge(i.severity)}</td>
        <td>
          <div style="font-weight:600;">${i.title}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${(i.description||'').slice(0,70)}${(i.description||'').length>70?'…':''}</div>
        </td>
        <td>${ATLAS.ui.statusBadge(i.status)}</td>
        <td style="font-size:11px;white-space:nowrap;">
          <div>${ATLAS.ui.formatDateShort(i.created_at)}</div>
          <div style="color:var(--text-muted);">${ATLAS.dashboard.timeAgo(i.created_at)}</div>
        </td>
        <td style="text-align:right;" onclick="event.stopPropagation()">
          <div style="display:flex;gap:4px;justify-content:flex-end;">
            ${i.status !== 'resolved' ? `<button class="btn btn-secondary btn-sm" onclick="ATLAS.incidents.quickResolve(${i.id})" data-tooltip="Resolve">✓</button>` : ''}
            <button class="btn btn-secondary btn-sm" onclick="ATLAS.incidents.showEdit(${JSON.stringify(i).replace(/"/g,'&quot;')})">${ATLAS.i18n.t('edit')}</button>
          </div>
        </td>
      </tr>`).join('') || `<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:32px;">${ATLAS.i18n.t('no_data')}</td></tr>`;
  },

  filter() {
    const q = (document.getElementById('inc-search')?.value||'').toLowerCase();
    const st = document.getElementById('inc-filter-status')?.value||'';
    const sv = document.getElementById('inc-filter-sev')?.value||'';
    const filtered = this._all.filter(i =>
      (!q || i.title.toLowerCase().includes(q) || (i.description||'').toLowerCase().includes(q) || (i.location||'').toLowerCase().includes(q)) &&
      (!st || i.status === st) && (!sv || i.severity === sv));
    this.renderTable(filtered);
  },

  showDetail(inc) {
    const colorMap = { critical: 'var(--danger)', warning: 'var(--warning)', info: 'var(--info)' };
    ATLAS.ui.openPanel(`${inc.title}`, `
      <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
        ${ATLAS.ui.severityBadge(inc.severity)}
        ${ATLAS.ui.statusBadge(inc.status)}
      </div>
      ${inc.description ? `<p style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin-bottom:16px;">${inc.description}</p>` : ''}
      <div class="divider"></div>
      <div style="display:flex;flex-direction:column;gap:8px;font-size:13px;">
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted);">Created</span><span>${ATLAS.ui.formatDate(inc.created_at)}</span></div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted);">Updated</span><span>${ATLAS.ui.formatDate(inc.updated_at)}</span></div>
        ${inc.lat && inc.lng ? `<div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted);">Location</span><span>${inc.lat.toFixed(4)}, ${inc.lng.toFixed(4)}</span></div>` : ''}
      </div>
      <div class="divider"></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        ${inc.status !== 'resolved' ? `<button class="btn btn-primary btn-sm" onclick="ATLAS.incidents.quickResolve(${inc.id})">✓ Resolve</button>` : ''}
        <button class="btn btn-secondary btn-sm" onclick="ATLAS.incidents.showEdit(${JSON.stringify(inc).replace(/"/g,'&quot;')})">${ATLAS.i18n.t('edit')}</button>
        ${inc.lat && inc.lng ? `<button class="btn btn-secondary btn-sm" onclick="ATLAS.router.go('map');setTimeout(()=>ATLAS.map.flyTo(${inc.lat},${inc.lng}),300)">🗺 Map</button>` : ''}
        ${inc.lat && inc.lng ? `<button class="btn btn-secondary btn-sm" onclick="ATLAS.navigation.setDestination('${inc.lat},${inc.lng}')">🧭 Navigate</button>` : ''}
      </div>`);
  },

  async quickResolve(id) {
    await ATLAS.api.put(`/api/incidents/${id}`, { status: 'resolved' });
    const inc = this._all.find(i => i.id === id);
    if (inc) inc.status = 'resolved';
    ATLAS.ui.closePanel();
    ATLAS.ui.toast('Incident resolved', 'success');
    this.filter();
  },

  exportCSV() {
    const rows = [['ID','Title','Severity','Status','Created','Description']];
    this._all.forEach(i => rows.push([i.id, i.title, i.severity, i.status, i.created_at, (i.description||'').replace(/,/g,';')]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'incidents.csv';
    a.click();
  },

  showCreate() {
    ATLAS.ui.modal(ATLAS.i18n.t('new_incident'), `
      <div class="form-group"><label class="form-label">${ATLAS.i18n.t('title')}</label><input id="ni-title" class="form-input" placeholder="Incident title"></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('severity')}</label>
          <select id="ni-sev" class="form-select"><option value="info">Info</option><option value="warning" selected>Warning</option><option value="critical">Critical</option></select>
        </div>
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('status')}</label>
          <select id="ni-status" class="form-select"><option value="open">Open</option><option value="in_progress">In Progress</option></select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Latitude</label><input id="ni-lat" class="form-input" type="number" step="any" placeholder="51.1657"></div>
        <div class="form-group"><label class="form-label">Longitude</label><input id="ni-lng" class="form-input" type="number" step="any" placeholder="10.4515"></div>
      </div>
      <div class="form-group"><label class="form-label">${ATLAS.i18n.t('description')}</label><textarea id="ni-desc" class="form-textarea" rows="3" placeholder="Describe the incident..."></textarea></div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.incidents.create()">+ ${ATLAS.i18n.t('create')}</button>`
    );
    setTimeout(() => document.getElementById('ni-title')?.focus(), 100);
  },

  async create() {
    const title = document.getElementById('ni-title').value.trim();
    if (!title) { ATLAS.ui.toast('Title is required', 'warning'); return; }
    const inc = await ATLAS.api.post('/api/incidents', {
      title, severity: document.getElementById('ni-sev').value,
      status: document.getElementById('ni-status').value,
      description: document.getElementById('ni-desc').value,
      lat: parseFloat(document.getElementById('ni-lat').value)||51.1657,
      lng: parseFloat(document.getElementById('ni-lng').value)||10.4515,
    });
    if (inc) {
      this._all.unshift(inc);
      ATLAS.state.incidents.unshift(inc);
    }
    ATLAS.ui.closeModal();
    ATLAS.ui.toast(`Incident "${title}" created`, 'success');
    this.filter();
  },

  showEdit(inc) {
    ATLAS.ui.modal(`${ATLAS.i18n.t('edit')}: ${inc.title}`, `
      <div class="form-group"><label class="form-label">${ATLAS.i18n.t('title')}</label><input id="ei-title" class="form-input" value="${(inc.title||'').replace(/"/g,'&quot;')}"></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('severity')}</label>
          <select id="ei-sev" class="form-select"><option value="info" ${inc.severity==='info'?'selected':''}>Info</option><option value="warning" ${inc.severity==='warning'?'selected':''}>Warning</option><option value="critical" ${inc.severity==='critical'?'selected':''}>Critical</option></select>
        </div>
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('status')}</label>
          <select id="ei-status" class="form-select"><option value="open" ${inc.status==='open'?'selected':''}>Open</option><option value="in_progress" ${inc.status==='in_progress'?'selected':''}>In Progress</option><option value="resolved" ${inc.status==='resolved'?'selected':''}>Resolved</option></select>
        </div>
      </div>
      <div class="form-group"><label class="form-label">${ATLAS.i18n.t('description')}</label><textarea id="ei-desc" class="form-textarea" rows="4">${(inc.description||'')}</textarea></div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.incidents.update(${inc.id})">${ATLAS.i18n.t('save')}</button>`
    );
  },

  async update(id) {
    const updated = await ATLAS.api.put(`/api/incidents/${id}`, {
      title: document.getElementById('ei-title').value,
      severity: document.getElementById('ei-sev').value,
      status: document.getElementById('ei-status').value,
      description: document.getElementById('ei-desc').value,
    });
    const idx = this._all.findIndex(i => i.id === id);
    if (idx >= 0 && updated) this._all[idx] = { ...this._all[idx], ...updated };
    ATLAS.ui.closeModal();
    ATLAS.ui.closePanel();
    ATLAS.ui.toast('Incident updated', 'success');
    this.filter();
  }
};

/* ============================================================
   Alerts Page
============================================================ */
ATLAS.alertsPage = {
  _wsRegistered: false,

  async render(el) {
    const unack = ATLAS.state.alerts.filter(a => !a.acknowledged).length;
    const critical = ATLAS.state.alerts.filter(a => a.severity === 'critical').length;
    el.innerHTML = `
      <div class="page-header">
        <h1>${ATLAS.i18n.t('alerts')}</h1>
        <div class="actions">
          <button class="btn btn-secondary" onclick="ATLAS.alertsPage.ackAll()">${ATLAS.i18n.t('ack_all')}</button>
          <button class="btn btn-primary" onclick="ATLAS.alertsPage.showCreate()">+ ${ATLAS.i18n.t('new_alert')}</button>
        </div>
      </div>
      <div class="kpi-grid" style="margin-bottom:16px;">
        <div class="kpi-card" style="padding:12px 16px;">
          <div class="kpi-label">TOTAL</div><div class="kpi-value" style="font-size:22px;">${ATLAS.state.alerts.length}</div><div class="kpi-icon">📋</div>
        </div>
        <div class="kpi-card" style="padding:12px 16px;cursor:pointer;" onclick="document.getElementById('al-filter').value='critical';ATLAS.alertsPage.filter()">
          <div class="kpi-label">CRITICAL</div><div class="kpi-value" style="font-size:22px;color:var(--danger);">${critical}</div><div class="kpi-icon">🚨</div>
        </div>
        <div class="kpi-card" style="padding:12px 16px;cursor:pointer;" onclick="document.getElementById('al-unack').checked=true;ATLAS.alertsPage.filter()">
          <div class="kpi-label">UNACKNOWLEDGED</div><div class="kpi-value" style="font-size:22px;color:var(--warning);">${unack}</div><div class="kpi-icon">⏳</div>
        </div>
        <div class="kpi-card" style="padding:12px 16px;">
          <div class="kpi-label">ACKNOWLEDGED</div><div class="kpi-value" style="font-size:22px;color:var(--success);">${ATLAS.state.alerts.length - unack}</div><div class="kpi-icon">✅</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;align-items:center;">
        <input id="al-search" class="form-input" style="flex:1;min-width:180px;" placeholder="${ATLAS.i18n.t('search')}..." oninput="ATLAS.alertsPage.filter()">
        <select id="al-filter" class="form-select" style="width:150px;" onchange="ATLAS.alertsPage.filter()">
          <option value="">All Severity</option>
          <option value="critical">🚨 Critical</option>
          <option value="warning">⚠️ Warning</option>
          <option value="info">ℹ️ Info</option>
        </select>
        <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;white-space:nowrap;">
          <input type="checkbox" id="al-unack" onchange="ATLAS.alertsPage.filter()"> Unacknowledged
        </label>
        <button class="btn btn-secondary btn-sm" onclick="document.getElementById('al-search').value='';document.getElementById('al-filter').value='';document.getElementById('al-unack').checked=false;ATLAS.alertsPage.filter()">✕</button>
      </div>
      <div id="al-result-count" style="font-size:12px;color:var(--text-muted);margin-bottom:8px;"></div>
      <div id="alert-list" style="display:flex;flex-direction:column;gap:8px;"></div>`;
    this.renderAlerts(ATLAS.state.alerts);
    if (!this._wsRegistered) {
      this._wsRegistered = true;
      ATLAS.ws.on('alert_new', () => this.renderAlerts(ATLAS.state.alerts));
      ATLAS.ws.on('alert_ack', () => this.renderAlerts(ATLAS.state.alerts));
      ATLAS.ws.on('alerts_all_ack', () => this.renderAlerts(ATLAS.state.alerts));
    }
  },

  filter() {
    const q = (document.getElementById('al-search')?.value||'').toLowerCase();
    const sev = document.getElementById('al-filter')?.value||'';
    const unack = document.getElementById('al-unack')?.checked||false;
    const filtered = ATLAS.state.alerts.filter(a =>
      (!q || (a.message||'').toLowerCase().includes(q) || (a.source||'').toLowerCase().includes(q)) &&
      (!sev || a.severity === sev) &&
      (!unack || !a.acknowledged));
    this.renderAlerts(filtered);
  },

  renderAlerts(list) {
    const el = document.getElementById('alert-list');
    const countEl = document.getElementById('al-result-count');
    if (countEl) countEl.textContent = `Showing ${Math.min(list.length,100)} of ${list.length} alert${list.length!==1?'s':''}`;
    if (!el) return;
    const icons = { critical:'🚨', warning:'⚠️', info:'ℹ️' };
    if (!list.length) {
      el.innerHTML = `<div class="card" style="text-align:center;color:var(--text-muted);padding:40px;">
        <div style="font-size:32px;margin-bottom:8px;">✅</div>
        <div>No alerts match your filter</div>
      </div>`;
      return;
    }
    el.innerHTML = list.slice(0,100).map(a => `
      <div class="alert-item ${a.severity} ${a.acknowledged?'acknowledged':''}" style="animation:fadeInDown 0.15s ease;">
        <span class="alert-icon">${icons[a.severity]||'ℹ️'}</span>
        <div class="alert-body">
          <div class="alert-msg">${a.message}</div>
          <div class="alert-meta">
            ${a.source ? `<span style="background:var(--bg-input);padding:1px 6px;border-radius:3px;font-size:10px;">${a.source}</span> · ` : ''}
            ${ATLAS.ui.formatDate(a.created_at)}
            ${a.acknowledged ? ' · <span style="color:var(--success);">✓ Acknowledged</span>' : ''}
          </div>
        </div>
        <div style="display:flex;gap:6px;align-items:center;flex-shrink:0;">
          ${ATLAS.ui.severityBadge(a.severity)}
          ${!a.acknowledged ? `<button class="alert-ack-btn" onclick="ATLAS.alertsPage.ack(${a.id})" data-tooltip="Acknowledge">✓</button>` : ''}
        </div>
      </div>`).join('');
  },

  async ack(id) {
    await ATLAS.api.post(`/api/alerts/${id}/acknowledge`);
    const a = ATLAS.state.alerts.find(a => a.id === id);
    if (a) a.acknowledged = 1;
    this.filter();
    ATLAS.alerts.updateBanner();
  },

  async ackAll() {
    await ATLAS.api.post('/api/alerts/acknowledge-all');
    ATLAS.state.alerts.forEach(a => a.acknowledged = 1);
    this.filter();
    ATLAS.alerts.updateBanner();
    ATLAS.ui.toast('All alerts acknowledged', 'success');
  },

  showCreate() {
    ATLAS.ui.modal(ATLAS.i18n.t('new_alert'), `
      <div class="form-group"><label class="form-label">${ATLAS.i18n.t('severity')}</label>
        <div style="display:flex;gap:8px;">
          <button type="button" class="btn btn-secondary btn-sm" id="sev-info" onclick="ATLAS.alertsPage._setSev('info')" style="flex:1;">ℹ️ Info</button>
          <button type="button" class="btn btn-secondary btn-sm" id="sev-warning" onclick="ATLAS.alertsPage._setSev('warning')" style="flex:1;">⚠️ Warning</button>
          <button type="button" class="btn btn-danger btn-sm" id="sev-critical" onclick="ATLAS.alertsPage._setSev('critical')" style="flex:1;">🚨 Critical</button>
        </div>
        <input type="hidden" id="na-sev" value="warning">
      </div>
      <div class="form-group"><label class="form-label">${ATLAS.i18n.t('message')}</label><textarea id="na-msg" class="form-textarea" rows="3" placeholder="Alert message..."></textarea></div>
      <div class="form-group"><label class="form-label">Source</label><input id="na-type" class="form-input" value="manual" placeholder="system / sensor / fleet / manual..."></div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.alertsPage.create()">🔔 ${ATLAS.i18n.t('create')}</button>`
    );
    setTimeout(() => { ATLAS.alertsPage._setSev('warning'); document.getElementById('na-msg')?.focus(); }, 50);
  },

  _setSev(sev) {
    document.getElementById('na-sev').value = sev;
    ['info','warning','critical'].forEach(s => {
      const btn = document.getElementById('sev-'+s);
      if (btn) { btn.className = `btn btn-sm ${s==='critical'?'btn-danger':'btn-secondary'} ${s===sev?'':''}`;
        if (s===sev) btn.style.outline = '2px solid var(--accent)'; else btn.style.outline = ''; }
    });
  },

  async create() {
    const msg = document.getElementById('na-msg').value.trim();
    if (!msg) { ATLAS.ui.toast('Message is required', 'warning'); return; }
    await ATLAS.api.post('/api/alerts', { message: msg, severity: document.getElementById('na-sev').value, type: document.getElementById('na-type').value });
    ATLAS.ui.closeModal();
    ATLAS.ui.toast('Alert created', 'success');
  }
};


/* ============================================================
   Chat Module
============================================================ */
ATLAS.chat = {
  currentRoom: null,
  currentDM: null,
  unread: {},
  _roomNames: {},  // id -> name cache

  render(el) {
    const rooms = ATLAS.state.chatRooms;
    // Build room name cache
    rooms.forEach(r => { this._roomNames[r.id] = r.name; });
    const totalUnread = Object.values(this.unread).reduce((s,v)=>s+v,0);
    el.innerHTML = `
      <div class="page-header">
        <h1>${ATLAS.i18n.t('chat')} ${totalUnread > 0 ? `<span class="badge badge-danger" style="font-size:12px;vertical-align:middle;">${totalUnread}</span>` : ''}</h1>
      </div>
      <div class="chat-layout">
        <div class="chat-sidebar">
          <div class="card" style="padding:12px;flex:1;display:flex;flex-direction:column;gap:0;">
            <div class="card-title" style="margin-bottom:8px;">${ATLAS.i18n.t('rooms')}</div>
            <div id="room-list" style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:2px;">
              ${rooms.map(r => `
                <div class="room-item ${r.id===this.currentRoom?'active':''}" onclick="ATLAS.chat.openRoom(${r.id},'${r.name}')" data-room="${r.id}" style="display:flex;align-items:center;justify-content:space-between;">
                  <span># ${r.name}</span>
                  <span class="room-badge ${(this.unread[r.id]||0)===0?'hidden':''}" id="badge-room-${r.id}">${this.unread[r.id]||''}</span>
                </div>`).join('')}
            </div>
            <button class="btn btn-secondary btn-sm w-full mt-8" onclick="ATLAS.chat.createRoom()">+ ${ATLAS.i18n.t('rooms')}</button>
          </div>
        </div>
        <div class="chat-main card" style="padding:0;overflow:hidden;display:flex;flex-direction:column;">
          <div id="chat-header" style="padding:12px 16px;border-bottom:1px solid var(--border);font-weight:700;display:flex;align-items:center;justify-content:space-between;">
            <span id="chat-header-title" style="color:var(--text-muted);font-weight:400;">Select a room to start chatting</span>
            <div id="chat-header-actions" style="display:none;gap:8px;">
              <button class="btn btn-secondary btn-sm" onclick="ATLAS.chat.loadRoom(ATLAS.chat.currentRoom)">🔄</button>
            </div>
          </div>
          <div id="chat-messages" class="chat-messages" style="flex:1;overflow-y:auto;"></div>
          <div class="chat-input-area" id="chat-input-area" style="display:none;">
            <input id="chat-input" class="form-input" placeholder="${ATLAS.i18n.t('message')}... (Enter to send, Shift+Enter for newline)" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();ATLAS.chat.send();}">
            <button class="btn btn-primary" onclick="ATLAS.chat.send()">${ATLAS.i18n.t('send')} ↵</button>
          </div>
        </div>
      </div>`;
    if (this.currentRoom) this.openRoom(this.currentRoom, this._roomNames[this.currentRoom]||'');
  },

  async openRoom(roomId, name) {
    this.currentRoom = roomId;
    this.currentDM = null;
    if (name) this._roomNames[roomId] = name;
    document.querySelectorAll('.room-item').forEach(el => el.classList.toggle('active', parseInt(el.dataset.room)===roomId));
    const headerTitle = document.getElementById('chat-header-title');
    const headerActions = document.getElementById('chat-header-actions');
    const inputArea = document.getElementById('chat-input-area');
    if (headerTitle) { headerTitle.textContent = '# ' + (this._roomNames[roomId] || roomId); headerTitle.style.color = 'var(--text-primary)'; headerTitle.style.fontWeight = '700'; }
    if (headerActions) headerActions.style.display = 'flex';
    if (inputArea) inputArea.style.display = 'flex';
    this.unread[roomId] = 0;
    const badge = document.getElementById(`badge-room-${roomId}`);
    if (badge) { badge.textContent = ''; badge.classList.add('hidden'); }

    await this.loadRoom(roomId);
    setTimeout(() => document.getElementById('chat-input')?.focus(), 50);
  },

  async loadRoom(roomId) {
    const msgEl = document.getElementById('chat-messages');
    if (!msgEl) return;
    msgEl.innerHTML = `<div style="padding:20px;text-align:center;color:var(--text-muted);">${ATLAS.i18n.t('loading')}</div>`;
    const msgs = await ATLAS.api.get(`/api/chat/rooms/${roomId}/messages?limit=80`);
    if (msgEl && msgs) {
      if (!msgs.length) { msgEl.innerHTML = `<div style="padding:32px;text-align:center;color:var(--text-muted);">No messages yet. Start the conversation!</div>`; return; }
      // Group messages by day
      let lastDate = '';
      msgEl.innerHTML = msgs.map(m => {
        const dayStr = new Date(m.timestamp).toLocaleDateString(ATLAS.i18n.lang, {weekday:'long',month:'long',day:'numeric'});
        const dayDiv = dayStr !== lastDate ? `<div style="text-align:center;margin:16px 0 8px;"><span style="font-size:11px;color:var(--text-muted);background:var(--bg-input);padding:3px 10px;border-radius:99px;">${dayStr}</span></div>` : '';
        lastDate = dayStr;
        return dayDiv + this.renderMsg(m);
      }).join('');
      msgEl.scrollTop = msgEl.scrollHeight;
    }
  },

  renderMsg(m) {
    const isMe = m.sender_id === ATLAS.state.user?.id;
    const time = new Date(m.timestamp).toLocaleTimeString(ATLAS.i18n.lang, {hour:'2-digit',minute:'2-digit'});
    const avatar = (m.full_name||m.username||'?')[0].toUpperCase();
    const text = (m.content||'')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/\*\*(.*?)\*\*/g,'<b>$1</b>')
      .replace(/`(.*?)`/g,'<code style="background:var(--bg-input);padding:1px 4px;border-radius:3px;font-family:var(--font-mono);">$1</code>')
      .replace(/(https?:\/\/[^\s<]+)/g,'<a href="$1" target="_blank" rel="noopener" style="color:var(--accent);">$1</a>')
      .replace(/\n/g,'<br>');
    return `<div class="msg ${isMe?'me':''}">
      <div class="msg-avatar" title="${m.full_name||m.username}">${avatar}</div>
      <div style="flex:1;min-width:0;">
        <div class="msg-meta">${isMe ? 'You' : (m.full_name||m.username)} <span style="font-size:10px;opacity:0.6;">${time}</span></div>
        <div class="msg-bubble"><div class="msg-text">${text}</div></div>
      </div>
    </div>`;
  },

  async send() {
    const input = document.getElementById('chat-input');
    const content = input?.value?.trim();
    if (!content || !this.currentRoom) return;
    input.value = '';
    // Optimistic rendering
    const msgEl = document.getElementById('chat-messages');
    if (msgEl) {
      const tmpMsg = { sender_id: ATLAS.state.user?.id, full_name: ATLAS.state.user?.full_name, username: ATLAS.state.user?.username, content, timestamp: new Date().toISOString() };
      msgEl.insertAdjacentHTML('beforeend', this.renderMsg(tmpMsg));
      msgEl.scrollTop = msgEl.scrollHeight;
    }
    try {
      await ATLAS.api.post(`/api/chat/rooms/${this.currentRoom}/messages`, { content });
    } catch(e) {
      ATLAS.ui.toast('Failed to send message', 'warning');
    }
  },

  onMessage(data) {
    const { room_id, message } = data;
    if (room_id === this.currentRoom) {
      // Only append if not our own message (we already did optimistic rendering)
      if (message.sender_id !== ATLAS.state.user?.id) {
        const msgEl = document.getElementById('chat-messages');
        if (msgEl) {
          msgEl.insertAdjacentHTML('beforeend', this.renderMsg(message));
          msgEl.scrollTop = msgEl.scrollHeight;
        }
      }
    } else {
      this.unread[room_id] = (this.unread[room_id]||0)+1;
      const badge = document.getElementById(`badge-room-${room_id}`);
      if (badge) { badge.textContent = this.unread[room_id]; badge.classList.remove('hidden'); }
      // Use actual room name from cache, or fall back to ID
      const roomName = this._roomNames[room_id] || `Room ${room_id}`;
      ATLAS.ui.toast(`${(message.full_name||message.username)||'?'}: ${message.content}`, 'info', `#${roomName}`);
    }
  },

  onDM(data) {
    ATLAS.ui.toast(data.content, 'info', `DM from ${data.full_name||data.username||'?'}`);
  },

  createRoom() {
    ATLAS.ui.modal('New Chat Room', `
      <div class="form-group">
        <label class="form-label">${ATLAS.i18n.t('name')}</label>
        <input id="nr-name" class="form-input" placeholder="ops-team" pattern="[a-z0-9-]+" title="Lowercase letters, numbers, hyphens">
        <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Use lowercase letters, numbers and hyphens</div>
      </div>
      <div class="form-group"><label class="form-label">${ATLAS.i18n.t('description')}</label><input id="nr-desc" class="form-input" placeholder="Optional description"></div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.chat.doCreateRoom()">+ Create Room</button>`
    );
    setTimeout(() => document.getElementById('nr-name')?.focus(), 50);
  },

  async doCreateRoom() {
    const name = document.getElementById('nr-name').value.trim().toLowerCase().replace(/[^a-z0-9-]/g,'-');
    if (!name) { ATLAS.ui.toast('Room name required','warning'); return; }
    try {
      const room = await ATLAS.api.post('/api/chat/rooms', { name, description: document.getElementById('nr-desc').value });
      ATLAS.state.chatRooms.push(room);
      this._roomNames[room.id] = room.name;
      ATLAS.ui.closeModal();
      ATLAS.router.go('chat', true);
      setTimeout(() => ATLAS.chat.openRoom(room.id, room.name), 200);
    } catch(e) { ATLAS.ui.toast(e.message||'Failed to create room','warning'); }
  }
};

/* ============================================================
   Sensors Page
============================================================ */
ATLAS.sensors = {
  sensorCharts: {},
  _sparklines: {},
  _history: {},  // sensor_id -> last 20 values for sparklines
  _wsRegistered: false,

  async render(el) {
    const sensors = await ATLAS.api.get('/api/sensors') || [];
    ATLAS.state.sensors = sensors;
    const alarmCount = sensors.filter(s => s.current_value != null && (s.current_value >= s.max_val * 0.95 || s.current_value <= s.min_val * 1.05)).length;

    el.innerHTML = `
      <div class="page-header">
        <h1>${ATLAS.i18n.t('sensors')}</h1>
        <div class="actions">
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.router.go('sensors',true)">🔄 ${ATLAS.i18n.t('refresh')}</button>
          <button class="btn btn-primary btn-sm" onclick="ATLAS.sensors.showAdd()">+ Add Sensor</button>
        </div>
      </div>
      ${alarmCount > 0 ? `<div style="background:var(--danger);color:white;padding:10px 16px;border-radius:var(--radius-sm);margin-bottom:16px;display:flex;align-items:center;gap:8px;animation:pulse 2s infinite;"><span>🚨</span><strong>${alarmCount} sensor${alarmCount>1?'s':''} in alarm state</strong></div>` : ''}
      <div id="pi-sensor-bar" style="margin-bottom:12px;"></div>
      <div class="sensor-grid" id="sensor-grid">
        ${sensors.map(s => this.renderCard(s)).join('')}
      </div>
      <div class="card mt-8">
        <div class="card-title" style="margin-bottom:16px;">📊 Sensor History</div>
        <div style="display:flex;gap:8px;margin-bottom:12px;align-items:flex-end;flex-wrap:wrap;">
          <div class="form-group" style="min-width:200px;margin-bottom:0;">
            <label class="form-label">Sensor</label>
            <select class="form-select" id="sensor-detail-select" onchange="ATLAS.sensors.loadDetail(this.value)">
              <option value="">– select sensor –</option>
              ${sensors.map(s=>`<option value="${s.id}">${s.name} (${s.unit})</option>`).join('')}
            </select>
          </div>
          <div class="form-group" style="min-width:120px;margin-bottom:0;">
            <label class="form-label">Timeframe</label>
            <select class="form-select" id="sensor-hours" onchange="ATLAS.sensors.loadDetail(document.getElementById('sensor-detail-select').value)">
              <option value="1">Last 1h</option>
              <option value="6" selected>Last 6h</option>
              <option value="24">Last 24h</option>
              <option value="72">Last 3 days</option>
            </select>
          </div>
          <div id="sensor-stats" style="font-size:12px;color:var(--text-muted);padding-bottom:4px;"></div>
        </div>
        <div id="sensor-detail-chart" style="height:240px;position:relative;"><canvas id="sensor-chart"></canvas></div>
      </div>`;
    if (!this._wsRegistered) {
      this._wsRegistered = true;
      ATLAS.ws.on('sensor_reading', data => this.onReading(data));
    }
    // Auto-load Pi sensors if available
    this.loadPiSensors();
  },

  async loadPiSensors() {
    const bar = document.getElementById('pi-sensor-bar');
    if (!bar) return;
    try {
      const data = await ATLAS.api.get('/api/system/sensors');
      if (!data || (data.cpu_temp_c == null && data.cpu_voltage_v == null)) {
        bar.innerHTML = '';
        return;
      }
      const t = k => ATLAS.i18n.t(k);
      const temp = data.cpu_temp_c != null ? `${data.cpu_temp_c}°C` : '–';
      const volt = data.cpu_voltage_v != null ? `${data.cpu_voltage_v}V` : '–';
      const tempColor = data.cpu_temp_c != null && data.cpu_temp_c > 75 ? 'var(--danger)' : data.cpu_temp_c > 60 ? 'var(--warning)' : 'var(--success)';
      bar.innerHTML = `<div class="card" style="padding:12px 16px;margin-bottom:0;">
        <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
          <span style="font-size:12px;font-weight:600;color:var(--text-muted);">🍓 ${t('pi_sensors')} (${data.platform})</span>
          <div style="display:flex;align-items:center;gap:6px;">
            <span style="font-size:14px;">🌡️</span>
            <span style="font-weight:700;font-size:16px;color:${tempColor};">${temp}</span>
            <span style="font-size:11px;color:var(--text-muted);">${t('cpu_temp')}</span>
          </div>
          <div style="display:flex;align-items:center;gap:6px;">
            <span style="font-size:14px;">⚡</span>
            <span style="font-weight:700;font-size:16px;">${volt}</span>
            <span style="font-size:11px;color:var(--text-muted);">${t('cpu_voltage')}</span>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.sensors.loadPiSensors()">🔄</button>
        </div>
      </div>`;
    } catch(e) {
      bar.innerHTML = '';
    }
  },

  renderCard(s) {
    const pct = s.current_value != null ? Math.round((s.current_value - s.min_val) / (s.max_val - s.min_val) * 100) : 50;
    const isAlarm = s.current_value != null && (s.current_value >= s.max_val * 0.95 || s.current_value <= s.min_val * 1.05);
    const clampedPct = Math.max(0, Math.min(100, pct));
    const typeIcons = { temperature:'🌡️', humidity:'💧', voltage:'⚡', co2:'💨', signal:'📶', fuel:'⛽', pressure:'🔵', default:'📡' };
    const icon = typeIcons[s.type] || typeIcons.default;
    return `<div class="sensor-card ${isAlarm?'alarm':''}" id="sensor-card-${s.id}" onclick="ATLAS.sensors.openDetail(${s.id})" style="cursor:pointer;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;">
        <div class="sensor-name">${s.name}</div>
        <span style="font-size:16px;">${icon}</span>
      </div>
      <div style="display:flex;align-items:baseline;gap:4px;">
        <span class="sensor-value" id="sv-${s.id}">${s.current_value?.toFixed(1)??'–'}</span>
        <span class="sensor-unit">${s.unit}</span>
        ${isAlarm ? '<span style="color:var(--danger);font-size:11px;animation:pulse 1s infinite;">⚠ ALARM</span>' : ''}
      </div>
      <div class="sensor-location" style="margin:4px 0;">📍 ${s.location||'–'}</div>
      <canvas id="sparkline-${s.id}" height="30" style="width:100%;margin:4px 0;"></canvas>
      <div class="sensor-bar" style="margin-top:4px;">
        <div class="sensor-bar-fill" id="sb-${s.id}" style="width:${clampedPct}%;background:${isAlarm?'var(--danger)':'var(--accent)'};transition:width 0.5s ease;"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-muted);margin-top:4px;">
        <span>${s.min_val}${s.unit}</span>
        <span style="font-size:9px;">${s.type}</span>
        <span>${s.max_val}${s.unit}</span>
      </div>
    </div>`;
  },

  openDetail(sensorId) {
    const select = document.getElementById('sensor-detail-select');
    if (select) { select.value = sensorId; this.loadDetail(sensorId); }
    const chartCard = document.querySelector('#sensor-detail-chart')?.closest('.card');
    if (chartCard) chartCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  onReading(data) {
    const { sensor_id, value } = data;
    const sensor = ATLAS.state.sensors.find(s => s.id === sensor_id);
    if (sensor) sensor.current_value = value;

    // Track history for sparklines
    if (!this._history[sensor_id]) this._history[sensor_id] = [];
    this._history[sensor_id].push(value);
    if (this._history[sensor_id].length > 20) this._history[sensor_id].shift();

    const valEl = document.getElementById(`sv-${sensor_id}`);
    if (valEl) valEl.textContent = value.toFixed ? value.toFixed(1) : value;
    const barEl = document.getElementById(`sb-${sensor_id}`);
    if (barEl && sensor) {
      const pct = Math.round((value - sensor.min_val) / (sensor.max_val - sensor.min_val) * 100);
      barEl.style.width = Math.max(0, Math.min(100, pct)) + '%';
      const isAlarm = value >= sensor.max_val * 0.95 || value <= sensor.min_val * 1.05;
      barEl.style.background = isAlarm ? 'var(--danger)' : 'var(--accent)';
      const card = document.getElementById(`sensor-card-${sensor_id}`);
      if (card) card.classList.toggle('alarm', isAlarm);
    }
    this.drawSparkline(sensor_id);
  },

  drawSparkline(sensorId) {
    const canvas = document.getElementById(`sparkline-${sensorId}`);
    if (!canvas) return;
    const vals = this._history[sensorId] || [];
    if (vals.length < 2) return;
    canvas.width = canvas.offsetWidth || 160;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const min = Math.min(...vals), max = Math.max(...vals);
    const range = max - min || 1;
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#60a5fa';
    ctx.lineWidth = 1.5;
    vals.forEach((v, i) => {
      const x = (i / (vals.length-1)) * w;
      const y = h - ((v - min) / range) * h;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
  },

  async loadDetail(sensorId) {
    if (!sensorId) return;
    const hours = document.getElementById('sensor-hours')?.value || '6';
    const [history, sensor] = await Promise.all([
      ATLAS.api.get(`/api/sensors/${sensorId}/history?hours=${hours}`),
      Promise.resolve(ATLAS.state.sensors.find(s => s.id == sensorId))
    ]);
    if (!history) return;

    // Show stats
    const vals = history.map(r => r.value);
    if (vals.length) {
      const avg = (vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(2);
      const min = Math.min(...vals).toFixed(2);
      const max = Math.max(...vals).toFixed(2);
      const statsEl = document.getElementById('sensor-stats');
      if (statsEl) statsEl.innerHTML = `<span style="color:var(--text-muted);">Avg: <b style="color:var(--accent);">${avg}</b> · Min: <b>${min}</b> · Max: <b>${max}</b> · ${vals.length} readings</span>`;
    }

    const canvas = document.getElementById('sensor-chart');
    if (!canvas || !window.Chart) return;
    if (this.sensorCharts.detail) this.sensorCharts.detail.destroy();
    const css = k => getComputedStyle(document.documentElement).getPropertyValue(k).trim();
    const accent = css('--accent');
    const danger = css('--danger');
    const warning = css('--warning');
    const axisColor = css('--text-muted');

    const labels = history.slice(-80).map(r => new Date(r.timestamp).toLocaleTimeString(ATLAS.i18n.lang, {hour:'2-digit',minute:'2-digit'}));
    const data = history.slice(-80).map(r => r.value);

    this.sensorCharts.detail = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: sensor?.name||'Sensor', data, borderColor: accent, backgroundColor: accent+'18', tension: 0.4, fill: true, pointRadius: 0, pointHoverRadius: 4, borderWidth: 2 },
          sensor ? { label: 'Max threshold', data: data.map(()=>sensor.max_val), borderColor: danger+'88', borderDash:[4,4], pointRadius:0, borderWidth:1, fill:false } : null,
          sensor ? { label: 'Min threshold', data: data.map(()=>sensor.min_val), borderColor: warning+'88', borderDash:[4,4], pointRadius:0, borderWidth:1, fill:false } : null,
        ].filter(Boolean)
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: true, position: 'bottom', labels: { color: axisColor, font: { size: 11 }, usePointStyle: true } }, tooltip: { mode: 'index', intersect: false } },
        scales: { x: { ticks: { maxTicksLimit: 10, color: axisColor, font: { size: 10 } }, grid: { color: 'rgba(128,128,128,0.08)' } }, y: { ticks: { color: axisColor, font: { size: 10 } }, grid: { color: 'rgba(128,128,128,0.08)' } } }
      }
    });
  },

  showAdd() {
    const typeUnits = { temperature: '°C', humidity: '%', voltage: 'V', co2: 'ppm', signal: 'dBm', fuel: '%', pressure: 'bar' };
    ATLAS.ui.modal('Add Sensor', `
      <div class="form-group"><label class="form-label">${ATLAS.i18n.t('name')}</label><input id="as-name" class="form-input" placeholder="e.g. Server Room Temp"></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('type')}</label>
          <select id="as-type" class="form-select" onchange="const u=({temperature:'°C',humidity:'%',voltage:'V',co2:'ppm',signal:'dBm',fuel:'%',pressure:'bar'})[this.value]||'';document.getElementById('as-unit').value=u;">
            <option>temperature</option><option>humidity</option><option>voltage</option><option>co2</option><option>signal</option><option>fuel</option><option>pressure</option><option>custom</option>
          </select>
        </div>
        <div class="form-group"><label class="form-label">Unit</label><input id="as-unit" class="form-input" placeholder="°C" value="°C"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Min Value</label><input id="as-min" class="form-input" type="number" value="0"></div>
        <div class="form-group"><label class="form-label">Max Value</label><input id="as-max" class="form-input" type="number" value="100"></div>
      </div>
      <div class="form-group"><label class="form-label">${ATLAS.i18n.t('location')}</label><input id="as-loc" class="form-input" placeholder="Building A, Floor 2"></div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.sensors.addSensor()">+ Add Sensor</button>`
    );
    setTimeout(() => document.getElementById('as-name')?.focus(), 50);
  },

  async addSensor() {
    const name = document.getElementById('as-name').value.trim();
    if (!name) { ATLAS.ui.toast('Name required','warning'); return; }
    await ATLAS.api.post('/api/sensors', {
      name, type: document.getElementById('as-type').value,
      unit: document.getElementById('as-unit').value,
      min_val: parseFloat(document.getElementById('as-min').value)||0,
      max_val: parseFloat(document.getElementById('as-max').value)||100,
      location: document.getElementById('as-loc').value
    });
    ATLAS.ui.closeModal();
    ATLAS.ui.toast(`Sensor "${name}" added`, 'success');
    ATLAS.router.go('sensors', true);
  }
};


/* ============================================================
   Analytics Page (AI)
============================================================ */
ATLAS.analyticsPage = {
  async render(el) {
    el.innerHTML = `
      <div class="page-header">
        <h1>${ATLAS.i18n.t('analytics')}</h1>
        <button class="btn btn-secondary btn-sm" onclick="ATLAS.analyticsPage.refresh()">🔄 ${ATLAS.i18n.t('refresh')}</button>
      </div>

      <!-- KPI row -->
      <div id="analytics-kpis" class="kpi-grid" style="margin-bottom:20px;"></div>

      <!-- Anomalies + Prediction -->
      <div class="grid-2" style="margin-bottom:16px;">
        <div class="card">
          <div class="card-title" style="display:flex;justify-content:space-between;align-items:center;">
            <span>🔍 ${ATLAS.i18n.t('anomalies')} <span id="anomaly-count" style="font-size:11px;background:var(--danger);color:white;padding:1px 6px;border-radius:10px;margin-left:6px;"></span></span>
            <span style="font-size:10px;color:var(--text-muted);">Z-Score &gt; 2.5</span>
          </div>
          <div id="anomaly-list"></div>
        </div>
        <div class="card">
          <div class="card-title" style="display:flex;justify-content:space-between;align-items:center;">
            <span>📈 ${ATLAS.i18n.t('predictions')}</span>
            <span style="font-size:10px;color:var(--text-muted);">Linear Regression</span>
          </div>
          <div class="chart-wrapper" style="height:240px;"><canvas id="pred-chart"></canvas></div>
        </div>
      </div>

      <!-- Alert trend + Incident pattern -->
      <div class="grid-2" style="margin-bottom:16px;">
        <div class="card">
          <div class="card-title">🚨 Alert Activity (24h)</div>
          <div class="chart-wrapper" style="height:200px;"><canvas id="alert-trend-chart"></canvas></div>
        </div>
        <div class="card">
          <div class="card-title">📊 Sensor Status Distribution</div>
          <div class="chart-wrapper" style="height:200px;position:relative;"><canvas id="sensor-dist-chart"></canvas></div>
        </div>
      </div>

      <!-- Heatmap -->
      <div class="card">
        <div class="card-title">🗓 Incident ${ATLAS.i18n.t('patterns')} <span style="font-size:10px;color:var(--text-muted);"> – Hour × Weekday heatmap</span></div>
        <div id="pattern-heatmap"></div>
      </div>`;
    await Promise.all([
      this.loadKPIs(),
      this.loadAnomalies(),
      this.loadPrediction(),
      this.loadPattern(),
      this.loadAlertTrend(),
      this.loadSensorDist(),
    ]);
  },

  async refresh() {
    const el = document.getElementById('page-content');
    if (el) await this.render(el);
  },

  async loadKPIs() {
    const el = document.getElementById('analytics-kpis');
    if (!el) return;
    try {
      const [anomalies, sensors, incidents, alerts] = await Promise.all([
        ATLAS.api.get('/api/analytics/anomalies').catch(()=>[]),
        ATLAS.api.get('/api/sensors').catch(()=>[]),
        ATLAS.api.get('/api/incidents?limit=200').catch(()=>[]),
        ATLAS.api.get('/api/alerts?limit=200').catch(()=>[]),
      ]);
      const openInc = (incidents||[]).filter(i=>i.status==='open').length;
      const critAlerts = (alerts||[]).filter(a=>a.severity==='critical'&&!a.acknowledged_at).length;
      const alarmSensors = (sensors||[]).filter(s=>s.in_alarm).length;
      el.innerHTML = [
        ['🔍', 'Anomalies', (anomalies||[]).length, 'danger'],
        ['🚨', 'Critical Alerts', critAlerts, 'danger'],
        ['📡', 'Sensors in Alarm', alarmSensors, 'warning'],
        ['⚡', 'Open Incidents', openInc, 'info'],
      ].map(([icon,label,val,color]) => `
        <div class="kpi-card">
          <div class="kpi-label">${label}</div>
          <div class="kpi-value" style="color:${val>0?'var(--'+color+')':'var(--success)'};">${val}</div>
          <div class="kpi-icon">${icon}</div>
        </div>`).join('');
    } catch(e) { console.warn('Analytics KPI load error', e); }
  },

  async loadAnomalies() {
    const anomalies = await ATLAS.api.get('/api/analytics/anomalies') || [];
    const el = document.getElementById('anomaly-list');
    const countEl = document.getElementById('anomaly-count');
    if (!el) return;
    if (countEl) { if (anomalies.length > 0) { countEl.textContent = anomalies.length; countEl.style.display=''; } else countEl.style.display='none'; }
    if (!anomalies.length) {
      el.innerHTML = `<div style="text-align:center;padding:24px;color:var(--text-muted);">
        <div style="font-size:32px;margin-bottom:8px;">✅</div>
        <div style="font-weight:600;">No anomalies detected</div>
        <div style="font-size:12px;margin-top:4px;">All sensor readings are within normal ranges</div>
      </div>`;
      return;
    }
    el.innerHTML = `<div style="display:flex;flex-direction:column;gap:8px;max-height:280px;overflow-y:auto;">` + anomalies.map(a => {
      const zAbs = Math.abs(a.z_score||0);
      const severity = zAbs > 4 ? 'critical' : zAbs > 3 ? 'warning' : 'info';
      const barW = Math.min(100, (zAbs/5)*100);
      return `
      <div style="padding:10px 12px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--bg-input);position:relative;overflow:hidden;">
        <div style="position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--${severity==='critical'?'danger':severity==='warning'?'warning':'accent'});"></div>
        <div style="display:flex;align-items:flex-start;gap:10px;">
          ${ATLAS.ui.severityBadge(severity)}
          <div style="flex:1;min-width:0;">
            <div style="font-size:13px;font-weight:600;margin-bottom:2px;">${a.sensor_name}</div>
            <div style="font-size:11px;color:var(--text-muted);">
              Value: <b style="color:var(--text-primary);">${a.current_value}${a.unit||''}</b>
              · Mean: ${(a.mean||0).toFixed(1)}${a.unit||''}
              · Z: <b style="color:var(--${severity==='critical'?'danger':severity==='warning'?'warning':'accent'});">${(a.z_score||0).toFixed(2)}</b>
            </div>
            <div class="progress" style="margin-top:6px;height:4px;">
              <div class="progress-bar ${severity}" style="width:${barW}%;"></div>
            </div>
          </div>
        </div>
      </div>`;
    }).join('') + `</div>`;
  },

  async loadPrediction() {
    const trends = await ATLAS.api.get('/api/analytics/trends?hours=12') || {};
    const data = trends.open_incidents || [];
    if (!data.length || !window.Chart) return;
    // Linear regression
    const n = data.length;
    const xs = data.map((_,i) => i);
    const ys = data.map(d => d.value);
    const sx = xs.reduce((a,b)=>a+b,0), sy = ys.reduce((a,b)=>a+b,0);
    const sxy = xs.reduce((a,b,i)=>a+b*ys[i],0), sxx = xs.reduce((a,b)=>a+b*b,0);
    const slope = (n*sxy - sx*sy)/(n*sxx - sx*sx || 1);
    const intercept = (sy - slope*sx)/n;
    const forecast = [0,1,2,3,4,5,6].map(i => Math.max(0, Math.round(slope*(n+i)+intercept)));
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    const warning = getComputedStyle(document.documentElement).getPropertyValue('--warning').trim();
    const ctx = document.getElementById('pred-chart');
    if (!ctx) return;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: [...data.slice(-12).map(d=>new Date(d.timestamp).toLocaleTimeString(ATLAS.i18n.lang,{hour:'2-digit',minute:'2-digit'})), ...['F+1','F+2','F+3','F+4','F+5','F+6','F+7']],
        datasets: [
          { label: 'Historical', data: [...ys.slice(-12), ...Array(7).fill(null)], borderColor: accent, backgroundColor: accent+'22', tension: 0.4, fill: true, pointRadius: 2 },
          { label: 'Forecast', data: [...Array(12).fill(null), ...forecast], borderColor: warning, backgroundColor: warning+'22', borderDash: [5,5], tension: 0.4, fill: true, pointRadius: 3 }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#aaa', font: { size: 11 } } } }, scales: { x: { ticks: { maxTicksLimit: 8, color: '#888' }, grid: { color: 'rgba(255,255,255,0.04)' } }, y: { beginAtZero: true, ticks: { color: '#888' }, grid: { color: 'rgba(255,255,255,0.04)' } } } }
    });
  },

  async loadPattern() {
    const pattern = await ATLAS.api.get('/api/analytics/incidents-pattern') || [];
    const el = document.getElementById('pattern-heatmap');
    if (!el || !pattern.length) return;
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const max = Math.max(...pattern.flat(), 1);
    const hours = Array.from({length:24},(_,i)=>i);
    el.innerHTML = `<div style="overflow-x:auto;">
      <div style="display:grid;grid-template-columns:40px repeat(24,1fr);gap:2px;min-width:600px;font-size:10px;">
        <div></div>${hours.map(h=>`<div style="text-align:center;color:var(--text-muted);padding-bottom:4px;">${h}</div>`).join('')}
        ${pattern.map((row,d)=>`
          <div style="color:var(--text-muted);display:flex;align-items:center;padding-right:6px;font-weight:600;">${days[d]}</div>
          ${row.map(v=>{
            const pct=v/max;
            return `<div title="${v} incident${v===1?'':'s'} at ${days[d]} hour ${hours[row.indexOf(v)]}" style="height:22px;border-radius:3px;background:linear-gradient(135deg,var(--accent),var(--danger));opacity:${0.08+pct*0.92};cursor:default;" onmouseover="this.style.outline='2px solid var(--accent)'" onmouseout="this.style.outline=''"></div>`;
          }).join('')}`).join('')}
      </div>
      <div style="margin-top:8px;font-size:11px;color:var(--text-muted);">Hover cells to see incident count. Hours 0–23 vs day of week. Darker = more incidents.</div>
    </div>`;
  },

  async loadAlertTrend() {
    const ctx = document.getElementById('alert-trend-chart');
    if (!ctx || !window.Chart) return;
    try {
      const alerts = await ATLAS.api.get('/api/alerts?limit=500') || [];
      // Bucket by hour for past 24h
      const now = Date.now();
      const buckets = Array(24).fill(0);
      const crit = Array(24).fill(0);
      const warn = Array(24).fill(0);
      alerts.forEach(a => {
        const hoursAgo = (now - new Date(a.created_at).getTime()) / 3600000;
        if (hoursAgo >= 0 && hoursAgo < 24) {
          const idx = Math.floor(hoursAgo);
          buckets[idx]++;
          if (a.severity === 'critical') crit[idx]++;
          else if (a.severity === 'warning') warn[idx]++;
        }
      });
      const labels = Array(24).fill(0).map((_,i)=>{
        const h = new Date(now - (23-i)*3600000);
        return h.toLocaleTimeString(ATLAS.i18n.lang,{hour:'2-digit',minute:'2-digit'});
      });
      // Reverse so oldest is first
      const css = k=>getComputedStyle(document.documentElement).getPropertyValue(k).trim();
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            { label: 'Critical', data: crit.reverse(), backgroundColor: css('--danger')+'cc', borderRadius: 2 },
            { label: 'Warning', data: warn.reverse(), backgroundColor: css('--warning')+'cc', borderRadius: 2 },
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: css('--text-muted'), font:{size:11}, usePointStyle:true } } },
          scales: {
            x: { stacked: true, ticks: { maxTicksLimit: 8, color: css('--text-muted'), font:{size:10} }, grid: { color: 'rgba(128,128,128,0.06)' } },
            y: { stacked: true, beginAtZero: true, ticks: { color: css('--text-muted'), font:{size:10}, stepSize: 1 }, grid: { color: 'rgba(128,128,128,0.06)' } }
          }
        }
      });
    } catch(e) { console.warn('Alert trend chart error', e); }
  },

  async loadSensorDist() {
    const ctx = document.getElementById('sensor-dist-chart');
    if (!ctx || !window.Chart) return;
    try {
      const sensors = await ATLAS.api.get('/api/sensors') || [];
      const typeCounts = {};
      sensors.forEach(s => { typeCounts[s.type] = (typeCounts[s.type]||0)+1; });
      const types = Object.keys(typeCounts);
      const counts = types.map(t => typeCounts[t]);
      const alarmCounts = types.map(t => sensors.filter(s=>s.type===t&&s.in_alarm).length);
      const colors = types.map((_,i) => `hsl(${(i*53+200)%360},60%,55%)`);
      const css = k=>getComputedStyle(document.documentElement).getPropertyValue(k).trim();
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: types.map(t => t.charAt(0).toUpperCase()+t.slice(1)),
          datasets: [{
            data: counts,
            backgroundColor: colors.map(c=>c+'cc'),
            borderColor: colors,
            borderWidth: 1.5,
            hoverOffset: 4,
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right', labels: { color: css('--text-muted'), font:{size:11}, padding:12 } },
            tooltip: {
              callbacks: {
                label(ctx) {
                  const t = types[ctx.dataIndex];
                  const alarm = alarmCounts[ctx.dataIndex];
                  return ` ${ctx.parsed} sensor${ctx.parsed!==1?'s':''}${alarm?', '+alarm+' in alarm':''}`;
                }
              }
            }
          },
          cutout: '60%',
        }
      });
    } catch(e) { console.warn('Sensor dist chart error', e); }
  }
};

/* ============================================================
   Logs Page
============================================================ */
ATLAS.logsPage = {
  _logs: [], _page: 0, _pageSize: 50,

  _actionColor(action='') {
    const a = action.toLowerCase();
    if (a.includes('login') || a.includes('auth')) return { bg: 'var(--accent)', label: 'AUTH' };
    if (a.includes('delete') || a.includes('remove')) return { bg: 'var(--danger)', label: 'DELETE' };
    if (a.includes('create') || a.includes('add') || a.includes('register')) return { bg: 'var(--success)', label: 'CREATE' };
    if (a.includes('update') || a.includes('edit') || a.includes('modify') || a.includes('put')) return { bg: 'var(--warning)', label: 'UPDATE' };
    if (a.includes('alert') || a.includes('alarm')) return { bg: '#e879f9', label: 'ALERT' };
    if (a.includes('incident')) return { bg: '#fb923c', label: 'INCIDENT' };
    if (a.includes('fleet') || a.includes('vehicle') || a.includes('trip')) return { bg: '#38bdf8', label: 'FLEET' };
    return { bg: 'var(--text-muted)', label: 'ACTION' };
  },

  _categories() {
    return ['all', 'auth', 'create', 'update', 'delete', 'alert', 'incident', 'fleet'];
  },

  async render(el) {
    el.innerHTML = `
      <div class="page-header">
        <h1>${ATLAS.i18n.t('logs')}</h1>
        <div class="actions">
          <a href="/api/export/logs" class="btn btn-secondary btn-sm">⬇ Logs CSV</a>
          <a href="/api/export/incidents" class="btn btn-secondary btn-sm">⬇ Incidents CSV</a>
        </div>
      </div>
      <div class="card">
        <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
          <input id="log-search" class="form-input" style="flex:1;min-width:200px;" placeholder="${ATLAS.i18n.t('search')}..." oninput="ATLAS.logsPage.filter()">
          <select id="log-category" class="form-select" style="width:140px;" onchange="ATLAS.logsPage.filter()">
            ${this._categories().map(c=>`<option value="${c}">${c.charAt(0).toUpperCase()+c.slice(1)}</option>`).join('')}
          </select>
          <select id="log-user-filter" class="form-select" style="width:140px;" onchange="ATLAS.logsPage.filter()">
            <option value="">All Users</option>
          </select>
        </div>
        <div id="log-stats" style="font-size:12px;color:var(--text-muted);margin-bottom:10px;"></div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th style="width:160px;">Timestamp</th>
                <th style="width:90px;">Category</th>
                <th>Action</th>
                <th style="width:110px;">User</th>
                <th>Details</th>
                <th style="width:110px;">IP</th>
              </tr>
            </thead>
            <tbody id="log-tbody">
              <tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-muted);">${ATLAS.i18n.t('loading')}</td></tr>
            </tbody>
          </table>
        </div>
        <div id="log-pagination" style="display:flex;align-items:center;justify-content:space-between;margin-top:12px;flex-wrap:wrap;gap:8px;"></div>
      </div>`;

    const logs = await ATLAS.api.get('/api/audit?limit=1000') || [];
    this._logs = logs;
    this._page = 0;

    // Populate user filter
    const users = [...new Set(logs.map(l=>l.username).filter(Boolean))];
    const userSel = document.getElementById('log-user-filter');
    if (userSel) users.forEach(u => { const o = document.createElement('option'); o.value = u; o.textContent = u; userSel.appendChild(o); });

    this.filter();
  },

  filter() {
    this._page = 0;
    const q = (document.getElementById('log-search')?.value||'').toLowerCase();
    const cat = document.getElementById('log-category')?.value||'all';
    const user = document.getElementById('log-user-filter')?.value||'';
    this._filtered = (this._logs||[]).filter(l => {
      if (q && !JSON.stringify(l).toLowerCase().includes(q)) return false;
      if (user && l.username !== user) return false;
      if (cat !== 'all') {
        const ac = this._actionColor(l.action);
        if (ac.label.toLowerCase() !== cat) return false;
      }
      return true;
    });
    this.renderPage();
  },

  renderPage() {
    const filtered = this._filtered || this._logs || [];
    const total = filtered.length;
    const start = this._page * this._pageSize;
    const end = Math.min(start + this._pageSize, total);
    const page = filtered.slice(start, end);

    const statsEl = document.getElementById('log-stats');
    if (statsEl) statsEl.textContent = `Showing ${start+1}–${end} of ${total} entries`;

    this.renderLogs(page);

    // Pagination
    const pagEl = document.getElementById('log-pagination');
    if (!pagEl) return;
    const totalPages = Math.ceil(total / this._pageSize);
    if (totalPages <= 1) { pagEl.innerHTML = ''; return; }

    pagEl.innerHTML = `
      <div style="display:flex;gap:4px;align-items:center;">
        <button class="btn btn-secondary btn-sm" onclick="ATLAS.logsPage.goPage(0)" ${this._page===0?'disabled':''}>«</button>
        <button class="btn btn-secondary btn-sm" onclick="ATLAS.logsPage.goPage(${this._page-1})" ${this._page===0?'disabled':''}>‹ Prev</button>
        ${Array.from({length:Math.min(5,totalPages)},(_,i)=>{
          const p = Math.max(0, Math.min(totalPages-5, this._page-2)) + i;
          return `<button class="btn btn-sm ${p===this._page?'btn-primary':'btn-secondary'}" onclick="ATLAS.logsPage.goPage(${p})">${p+1}</button>`;
        }).join('')}
        <button class="btn btn-secondary btn-sm" onclick="ATLAS.logsPage.goPage(${this._page+1})" ${this._page>=totalPages-1?'disabled':''}>Next ›</button>
        <button class="btn btn-secondary btn-sm" onclick="ATLAS.logsPage.goPage(${totalPages-1})" ${this._page>=totalPages-1?'disabled':''}>»</button>
      </div>
      <div style="font-size:12px;color:var(--text-muted);">Page ${this._page+1} / ${totalPages}</div>`;
  },

  goPage(p) {
    const totalPages = Math.ceil((this._filtered||this._logs||[]).length / this._pageSize);
    this._page = Math.max(0, Math.min(totalPages-1, p));
    this.renderPage();
    document.querySelector('.table-wrap')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  renderLogs(logs) {
    const tbody = document.getElementById('log-tbody');
    if (!tbody) return;
    tbody.innerHTML = logs.map(l => {
      const ac = this._actionColor(l.action);
      const dt = new Date(l.timestamp);
      const timeStr = dt.toLocaleTimeString(ATLAS.i18n.lang,{hour:'2-digit',minute:'2-digit',second:'2-digit'});
      const dateStr = dt.toLocaleDateString(ATLAS.i18n.lang,{month:'short',day:'numeric'});
      return `
        <tr style="font-size:12px;">
          <td style="font-family:var(--font-mono);white-space:nowrap;font-size:11px;">
            <div>${dateStr}</div>
            <div style="color:var(--text-muted);font-size:10px;">${timeStr}</div>
          </td>
          <td>
            <span style="font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;background:${ac.bg}22;color:${ac.bg};white-space:nowrap;">${ac.label}</span>
          </td>
          <td style="font-family:var(--font-mono);font-size:11px;color:var(--text-secondary);">${l.action}</td>
          <td>
            ${l.username ? `<div style="display:flex;align-items:center;gap:6px;">
              <div style="width:22px;height:22px;border-radius:50%;background:var(--accent-dim);border:1px solid var(--accent);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:var(--accent);flex-shrink:0;">${l.username[0].toUpperCase()}</div>
              <span>${l.username}</span>
            </div>` : '<span style="color:var(--text-muted);">–</span>'}
          </td>
          <td style="color:var(--text-muted);max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${(l.details||'').replace(/"/g,'&quot;')}">${l.details||'–'}</td>
          <td style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);">${l.ip_addr||'–'}</td>
        </tr>`;
    }).join('') || `<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-muted);">${ATLAS.i18n.t('no_data')}</td></tr>`;
  }
};


/* ============================================================
   Fleet Management
============================================================ */
ATLAS.fleet = {
  _vehicles: [], _drivers: [], _trips: [], _maintenance: [],
  _tab: 'vehicles',
  _fleetMap: null,   // cached Leaflet map instance for fleet map tab
  _fuelLogs: [],
  _wsRegistered: false,

  async render(el) {
    // Register WS handlers once for live vehicle updates
    if (!this._wsRegistered) {
      this._wsRegistered = true;
      ATLAS.ws.on('fleet_vehicle_update', data => {
        // Update vehicle in cached list
        const idx = this._vehicles.findIndex(v => v.id === data.id);
        if (idx >= 0) this._vehicles[idx] = data;
        // If fleet vehicles tab is currently visible, refresh the row
        if (this._tab === 'vehicles' && document.getElementById('fleet-vehicles-tbody')) {
          this.renderVehicles(document.getElementById('fleet-tab-content'));
        }
        // If fleet map is open, move marker
        if (this._tab === 'map' && data.lat && data.lng) {
          this.moveVehicleMarker(data.id, data.lat, data.lng);
        }
        // Refresh KPI stats
        if (document.getElementById('fleet-stats-row')) this.loadStats();
      });
    }
    el.innerHTML = `
      <div class="page-header">
        <h1>${ATLAS.i18n.t('fleet')}</h1>
        <div class="actions">
          <a href="/api/export/fleet" class="btn btn-secondary btn-sm">⬇ Export</a>
          <button class="btn btn-primary btn-sm" id="fleet-add-btn" onclick="ATLAS.fleet.showAdd()">+ ${ATLAS.i18n.t('new_vehicle')}</button>
        </div>
      </div>
      <div id="fleet-stats-row" class="kpi-grid" style="margin-bottom:16px;"></div>
      <div class="tabs">
        <div class="tab active" data-tab="vehicles" onclick="ATLAS.fleet.switchTab('vehicles')">${ATLAS.i18n.t('vehicles')}</div>
        <div class="tab" data-tab="drivers" onclick="ATLAS.fleet.switchTab('drivers')">${ATLAS.i18n.t('drivers')}</div>
        <div class="tab" data-tab="trips" onclick="ATLAS.fleet.switchTab('trips')">${ATLAS.i18n.t('trips')}</div>
        <div class="tab" data-tab="maintenance" onclick="ATLAS.fleet.switchTab('maintenance')">${ATLAS.i18n.t('maintenance')}</div>
        <div class="tab" data-tab="fuel" onclick="ATLAS.fleet.switchTab('fuel')">${ATLAS.i18n.t('fuel_log')}</div>
        <div class="tab" data-tab="map" onclick="ATLAS.fleet.switchTab('map')">🗺 Map</div>
      </div>
      <div id="fleet-tab-content"></div>`;
    await this.loadStats();
    await this.switchTab('vehicles');
  },

  async loadStats() {
    const stats = await ATLAS.api.get('/api/fleet/stats');
    if (!stats) return;
    const el = document.getElementById('fleet-stats-row');
    if (!el) return;
    el.innerHTML = [
      ['🚗', ATLAS.i18n.t('vehicles'), stats.total_vehicles],
      ['✅', ATLAS.i18n.t('available'), stats.by_status?.available||0],
      ['🛣️', ATLAS.i18n.t('on_trip'), stats.by_status?.on_trip||0],
      ['🔧', ATLAS.i18n.t('maintenance'), stats.by_status?.maintenance||0],
      ['🗺', ATLAS.i18n.t('trips'), stats.total_trips],
      ['💶', 'Fuel Cost', '€'+stats.total_fuel_cost],
    ].map(([icon,label,val])=>`
      <div class="kpi-card" style="padding:12px 16px;">
        <div class="kpi-label">${label}</div>
        <div class="kpi-value" style="font-size:22px;">${val}</div>
        <div class="kpi-icon">${icon}</div>
      </div>`).join('');
  },

  async switchTab(tab) {
    this._tab = tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab===tab));
    const addBtn = document.getElementById('fleet-add-btn');
    const labels = { vehicles: ATLAS.i18n.t('new_vehicle'), drivers: ATLAS.i18n.t('new_driver'), trips: ATLAS.i18n.t('new_trip'), maintenance: ATLAS.i18n.t('new_maintenance'), fuel: ATLAS.i18n.t('add_fuel'), map: null };
    const actions = { vehicles: ()=>ATLAS.fleet.showAdd(), drivers: ()=>ATLAS.fleet.showAddDriver(), trips: ()=>ATLAS.fleet.showAddTrip(), maintenance: ()=>ATLAS.fleet.showAddMaintenance(), fuel: ()=>ATLAS.fleet.showAddFuel(), map: null };
    if (addBtn) { if (labels[tab]) { addBtn.textContent='+ '+labels[tab]; addBtn.onclick=actions[tab]; addBtn.style.display=''; } else addBtn.style.display='none'; }
    const content = document.getElementById('fleet-tab-content');
    if (!content) return;
    content.innerHTML = `<div style="padding:20px;text-align:center;color:var(--text-muted);">${ATLAS.i18n.t('loading')}</div>`;
    if (tab==='vehicles') await this.renderVehicles(content);
    else if (tab==='drivers') await this.renderDrivers(content);
    else if (tab==='trips') await this.renderTrips(content);
    else if (tab==='maintenance') await this.renderMaintenance(content);
    else if (tab==='fuel') await this.renderFuel(content);
    else if (tab==='map') this.renderFleetMap(content);
  },

  async renderVehicles(el) {
    const vehicles = await ATLAS.api.get('/api/fleet/vehicles') || [];
    this._vehicles = vehicles;
    el.innerHTML = `
      <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
        <input class="form-input" style="flex:1;min-width:200px;" placeholder="${ATLAS.i18n.t('search')}..." oninput="ATLAS.fleet.filterVehicles(this.value)">
        <select class="form-select" style="width:160px;" onchange="ATLAS.fleet.filterVehicleStatus(this.value)">
          <option value="">All Status</option><option>available</option><option>on_trip</option><option>maintenance</option><option>out_of_service</option>
        </select>
      </div>
      <div id="vehicle-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;">
        ${vehicles.map(v=>this.vehicleCard(v)).join('')}
      </div>`;
  },

  vehicleCard(v) {
    const today = new Date().toISOString().split('T')[0];
    const tuevWarn = v.tuev_expiry && v.tuev_expiry <= new Date(Date.now()+14*864e5).toISOString().split('T')[0];
    const insWarn = v.insurance_expiry && v.insurance_expiry <= new Date(Date.now()+30*864e5).toISOString().split('T')[0];
    // Fuel gauge
    const cap = v.fuel_capacity_l || 0;
    const cur = v.fuel_current_l || 0;
    const fuelPct = cap > 0 ? Math.min(100, Math.round(cur / cap * 100)) : null;
    const fuelColor = fuelPct === null ? 'var(--text-muted)' : fuelPct < 20 ? 'var(--danger)' : fuelPct < 40 ? 'var(--warning)' : 'var(--success)';
    // Range estimate
    const avg = v.fuel_avg_l100km || 0;
    const range = (cap > 0 && avg > 0 && cur > 0) ? Math.round(cur / avg * 100) : null;
    return `<div class="fleet-card" onclick="ATLAS.fleet.showVehicleDetail(${v.id})">
      <div class="fleet-type-icon">${ATLAS.ui.vehicleIcon(v.type)}</div>
      <div class="fleet-vehicle-name">${v.name}</div>
      <div class="fleet-vehicle-meta">${v.make||''} ${v.model||''} ${v.year?'('+v.year+')':''}</div>
      <div style="margin:8px 0;">${ATLAS.ui.statusBadge(v.status)}</div>
      <div class="fleet-vehicle-details">
        ${v.license_plate?`<div class="fleet-detail"><span>Plate</span><span>${v.license_plate}</span></div>`:''}
        ${v.driver_name?`<div class="fleet-detail"><span>Driver</span><span>${v.driver_name}</span></div>`:''}
        <div class="fleet-detail"><span>Odometer</span><span>${(v.odometer_km||0).toLocaleString()} km</span></div>
        ${fuelPct !== null ? `
        <div class="fleet-detail" style="flex-direction:column;gap:4px;align-items:stretch;">
          <div style="display:flex;justify-content:space-between;font-size:11px;">
            <span>⛽ ${ATLAS.i18n.t('fuel_current')}</span>
            <span style="color:${fuelColor};font-weight:600;">${cur.toFixed(0)}L / ${cap.toFixed(0)}L (${fuelPct}%)</span>
          </div>
          <div style="background:var(--border);border-radius:4px;height:6px;overflow:hidden;">
            <div style="background:${fuelColor};width:${fuelPct}%;height:100%;transition:width 0.3s;border-radius:4px;"></div>
          </div>
          ${range ? `<div style="font-size:10px;color:var(--text-muted);text-align:right;">~${range} km range</div>` : ''}
        </div>` : ''}
        ${tuevWarn?`<div class="fleet-detail" style="color:var(--warning)"><span>⚠ TÜV</span><span>${v.tuev_expiry}</span></div>`:''}
        ${insWarn?`<div class="fleet-detail" style="color:var(--warning)"><span>⚠ Insurance</span><span>${v.insurance_expiry}</span></div>`:''}
      </div>
    </div>`;
  },

  filterVehicles(q) {
    const filtered = this._vehicles.filter(v => JSON.stringify(v).toLowerCase().includes(q.toLowerCase()));
    const grid = document.getElementById('vehicle-grid');
    if (grid) grid.innerHTML = filtered.map(v=>this.vehicleCard(v)).join('');
  },

  filterVehicleStatus(s) {
    const filtered = s ? this._vehicles.filter(v=>v.status===s) : this._vehicles;
    const grid = document.getElementById('vehicle-grid');
    if (grid) grid.innerHTML = filtered.map(v=>this.vehicleCard(v)).join('');
  },

  async showVehicleDetail(id) {
    const v = this._vehicles.find(v=>v.id===id);
    if (!v) return;
    const [fuel, docs, maintenance] = await Promise.all([
      ATLAS.api.get(`/api/fleet/fuel?vehicle_id=${id}`).catch(()=>[]),
      ATLAS.api.get(`/api/fleet/documents?vehicle_id=${id}`).catch(()=>[]),
      ATLAS.api.get(`/api/fleet/maintenance?vehicle_id=${id}`).catch(()=>[]),
    ]);
    const totalFuel = (fuel||[]).reduce((s,f)=>s+(f.total_cost||0),0);
    const totalLit = (fuel||[]).reduce((s,f)=>s+(f.liters||0),0);
    const pending = (maintenance||[]).filter(m=>m.status!=='completed');
    const today = new Date().toISOString().split('T')[0];

    ATLAS.ui.openPanel(`${ATLAS.ui.vehicleIcon(v.type)} ${v.name}`, `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
        ${ATLAS.ui.statusBadge(v.status)}
        ${v.driver_name?`<span style="font-size:12px;color:var(--text-muted);">👤 ${v.driver_name}</span>`:''}
      </div>

      <div style="display:flex;flex-direction:column;gap:6px;font-size:13px;margin-bottom:16px;">
        ${[
          ['Type', v.type+(v.subtype?' / '+v.subtype:'')],
          ['Make / Model', `${v.make||''} ${v.model||''}`.trim()||'–'],
          ['Year', v.year||'–'],
          ['Plate', v.license_plate||'–'],
          ['VIN', v.vin||'–'],
          ['Fuel Type', v.fuel_type||'–'],
          ['Seats', v.seats||'–'],
          ['Payload', v.payload_kg?v.payload_kg+'kg':'–'],
          ['Odometer', (v.odometer_km||0).toLocaleString()+' km'],
          ['TÜV/Inspection', v.tuev_expiry
            ? `<span style="color:${v.tuev_expiry<=new Date(Date.now()+14*864e5).toISOString().split('T')[0]?'var(--warning)':'inherit'}">${v.tuev_expiry}${v.tuev_expiry<today?' ⚠':''}</span>`
            : '–'],
          ['Insurance', v.insurance_expiry
            ? `<span style="color:${v.insurance_expiry<=new Date(Date.now()+30*864e5).toISOString().split('T')[0]?'var(--warning)':'inherit'}">${v.insurance_expiry}${v.insurance_expiry<today?' ⚠':''}</span>`
            : '–'],
        ].map(([k,val])=>`
          <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid var(--border);">
            <span style="color:var(--text-muted);font-size:12px;">${k}</span>
            <span style="font-weight:500;font-size:13px;">${val}</span>
          </div>`).join('')}
      </div>

      <div class="divider"></div>
      <div style="font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:0.5px;margin-bottom:8px;">ASSIGN DRIVER</div>
      <div style="display:flex;gap:8px;margin-bottom:16px;">
        <select id="assign-driver-sel" class="form-select" style="flex:1;">
          <option value="">– No Driver –</option>
          ${(this._drivers||[]).map(d=>`<option value="${d.id}" ${d.id===(v.assigned_driver||v.driver_id)?'selected':''}>${d.full_name} (${d.license_class||'?'})</option>`).join('')}
        </select>
        <button class="btn btn-primary btn-sm" onclick="ATLAS.fleet.assignDriver(${v.id})">Assign</button>
      </div>

      <div class="divider"></div>
      <div style="font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:0.5px;margin-bottom:8px;">⛽ FUEL LEVEL</div>
      ${(()=>{
        const cap = v.fuel_capacity_l || 0;
        const cur = v.fuel_current_l || 0;
        const avg = v.fuel_avg_l100km || 0;
        const fuelPct = cap > 0 ? Math.min(100, Math.round(cur / cap * 100)) : 0;
        const fuelColor = fuelPct < 20 ? 'var(--danger)' : fuelPct < 40 ? 'var(--warning)' : 'var(--success)';
        const range = (cap > 0 && avg > 0 && cur > 0) ? Math.round(cur / avg * 100) : null;
        return `
        <div style="margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;">
            <span style="color:var(--text-muted);">Current / Capacity</span>
            <span style="font-weight:700;color:${fuelColor};">${cur.toFixed(1)} L / ${cap.toFixed(0)} L</span>
          </div>
          <div style="background:var(--border);border-radius:6px;height:10px;overflow:hidden;margin-bottom:4px;">
            <div style="background:${fuelColor};width:${fuelPct}%;height:100%;border-radius:6px;transition:width 0.5s;"></div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);">
            <span>${fuelPct}% full${avg>0?` · ${avg.toFixed(1)} L/100km avg`:''}</span>
            ${range?`<span>~${range} km range</span>`:''}
          </div>
          <button class="btn btn-secondary btn-sm" style="margin-top:8px;width:100%;" onclick="ATLAS.fleet.showUpdateFuelLevel(${v.id},${cur},${cap},${avg})">⛽ Update Fuel Level</button>
        </div>`;
      })()}

      <div class="divider"></div>
      <div style="font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:0.5px;margin-bottom:8px;">FUEL LOG SUMMARY</div>
      <div class="kpi-grid" style="grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;">
        <div class="kpi-card" style="padding:8px 12px;">
          <div class="kpi-label">Total Liters</div>
          <div class="kpi-value" style="font-size:18px;">${totalLit.toFixed(1)} L</div>
        </div>
        <div class="kpi-card" style="padding:8px 12px;">
          <div class="kpi-label">Total Cost</div>
          <div class="kpi-value" style="font-size:18px;">€${totalFuel.toFixed(0)}</div>
        </div>
      </div>

      ${pending.length > 0 ? `
      <div class="divider"></div>
      <div style="font-size:11px;font-weight:700;color:var(--warning);letter-spacing:0.5px;margin-bottom:8px;">⚠ PENDING MAINTENANCE (${pending.length})</div>
      ${pending.map(m=>`
        <div style="display:flex;justify-content:space-between;font-size:12px;padding:5px 0;border-bottom:1px solid var(--border);">
          <span>${m.type}</span>
          <span style="color:${m.scheduled_date&&m.scheduled_date<today?'var(--danger)':'var(--warning)'};">${m.scheduled_date||'–'}</span>
        </div>`).join('')}` : ''}

      <div class="divider"></div>
      <div style="font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:0.5px;margin-bottom:8px;">DOCUMENTS (${(docs||[]).length})</div>
      ${(docs||[]).length ? docs.map(d=>`
        <div style="display:flex;justify-content:space-between;font-size:12px;padding:5px 0;border-bottom:1px solid var(--border);">
          <span>${d.name}</span>
          <span style="color:${d.expiry_date&&d.expiry_date<today?'var(--danger)':'var(--text-muted)'};">${d.expiry_date||'–'}</span>
        </div>`).join('') : '<div style="color:var(--text-muted);font-size:12px;">No documents</div>'}

      <div class="divider"></div>
      <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;">
        <button class="btn btn-secondary btn-sm" onclick="ATLAS.fleet.showEditVehicle(${v.id})">✏ ${ATLAS.i18n.t('edit')}</button>
        <button class="btn btn-secondary btn-sm" onclick="ATLAS.fleet.showAddFuel()">⛽ ${ATLAS.i18n.t('add_fuel')}</button>
        <button class="btn btn-secondary btn-sm" onclick="ATLAS.fleet.showAddMaintenance()">🔧 Add Maintenance</button>
        <button class="btn btn-secondary btn-sm" onclick="ATLAS.fleet.showUpdatePosition(${v.id},${v.lat||0},${v.lng||0})">📍 ${ATLAS.i18n.t('update_position')}</button>
        ${v.lat&&v.lng?`<button class="btn btn-secondary btn-sm" onclick="ATLAS.fleet.navigateToVehicle(${v.lat},${v.lng})">🧭 Navigate</button>`:''}
      </div>`);
  },

  async assignDriver(vehicleId) {
    const driverId = document.getElementById('assign-driver-sel')?.value;
    await ATLAS.api.put(`/api/fleet/vehicles/${vehicleId}`, {
      assigned_driver: driverId ? parseInt(driverId) : null
    });
    ATLAS.ui.toast('Driver assigned', 'success');
    ATLAS.ui.closePanel();
    await this.switchTab('vehicles');
  },

  navigateToVehicle(lat, lng) {
    ATLAS.ui.closePanel();
    ATLAS.state.navDestLat = lat;
    ATLAS.state.navDestLng = lng;
    ATLAS.router.go('navigation');
  },

  moveVehicleMarker(id, lat, lng) {
    const marker = ATLAS.state.fleetMapMarkers?.[id];
    if (marker) {
      marker.setLatLng([lat, lng]);
    }
  },

  async renderDrivers(el) {
    const drivers = await ATLAS.api.get('/api/fleet/drivers') || [];
    this._drivers = drivers;
    el.innerHTML = `
      <div class="card">
        <div class="table-wrap">
          <table>
            <thead><tr><th>${ATLAS.i18n.t('name')}</th><th>License</th><th>Expiry</th><th>Vehicle</th><th>Status</th><th></th></tr></thead>
            <tbody>${drivers.map(d=>`
              <tr>
                <td><div style="font-weight:600;">${d.full_name}</div><div style="font-size:11px;color:var(--text-muted);">${d.phone||''}</div></td>
                <td><code>${d.license_class}</code></td>
                <td style="color:${d.license_expiry&&d.license_expiry<new Date(Date.now()+30*864e5).toISOString().split('T')[0]?'var(--warning)':'inherit'}">${d.license_expiry||'–'}</td>
                <td>${d.vehicle_name||'–'}</td>
                <td>${ATLAS.ui.statusBadge(d.status)}</td>
                <td><button class="btn btn-secondary btn-sm" onclick="ATLAS.fleet.showEditDriver(${JSON.stringify(d).replace(/"/g,'&quot;')})">Edit</button></td>
              </tr>`).join('')||`<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--text-muted);">No drivers</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>`;
  },

  async renderTrips(el) {
    const trips = await ATLAS.api.get('/api/fleet/trips') || [];
    this._trips = trips;
    const active = trips.filter(t=>t.status==='active').length;
    const planned = trips.filter(t=>t.status==='planned').length;
    const completed = trips.filter(t=>t.status==='completed').length;
    el.innerHTML = `
      <div class="kpi-grid" style="margin-bottom:16px;">
        <div class="kpi-card" style="cursor:pointer;" onclick="ATLAS.fleet._filterTrips('planned')"><div class="kpi-label">Planned</div><div class="kpi-value" style="color:var(--text-muted);">${planned}</div><div class="kpi-icon">📅</div></div>
        <div class="kpi-card" style="cursor:pointer;" onclick="ATLAS.fleet._filterTrips('active')"><div class="kpi-label">Active</div><div class="kpi-value" style="color:var(--success);">${active}</div><div class="kpi-icon">🛣️</div></div>
        <div class="kpi-card" style="cursor:pointer;" onclick="ATLAS.fleet._filterTrips('completed')"><div class="kpi-label">Completed</div><div class="kpi-value" style="color:var(--accent);">${completed}</div><div class="kpi-icon">✅</div></div>
        <div class="kpi-card" style="cursor:pointer;" onclick="ATLAS.fleet._filterTrips('')"><div class="kpi-label">Total km</div><div class="kpi-value">${trips.reduce((s,t)=>s+(t.distance_km||0),0).toFixed(0)}</div><div class="kpi-icon">📏</div></div>
      </div>
      <div class="card">
        <div style="display:flex;gap:8px;margin-bottom:12px;">
          <input class="form-input" style="flex:1;" placeholder="Search trips..." id="trip-search" oninput="ATLAS.fleet._filterTrips('')">
          <select class="form-select" style="width:150px;" id="trip-status-filter" onchange="ATLAS.fleet._filterTrips(this.value)">
            <option value="">All Status</option>
            <option value="planned">Planned</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Trip</th><th>Vehicle</th><th>Driver</th><th>Departure</th><th>Status</th><th>Distance</th><th>Actions</th></tr></thead>
            <tbody id="trips-tbody">${this._renderTripRows(trips)}</tbody>
          </table>
        </div>
      </div>`;
  },

  _renderTripRows(trips) {
    return trips.map(t=>`
      <tr>
        <td>
          <div style="font-weight:600;">${t.title}</div>
          <div style="font-size:11px;color:var(--text-muted);">${t.origin||''}${t.origin&&t.destination?' → ':''}${t.destination||''}</div>
        </td>
        <td>${t.vehicle_name||'–'}</td>
        <td>${t.driver_name||'–'}</td>
        <td style="font-size:12px;white-space:nowrap;">${ATLAS.ui.formatDateShort(t.departure_time)}</td>
        <td>${ATLAS.ui.statusBadge(t.status)}</td>
        <td>${t.distance_km?t.distance_km+' km':'–'}</td>
        <td>
          <div style="display:flex;gap:4px;">
            ${t.status==='active'?`<button class="btn btn-success btn-sm" onclick="ATLAS.fleet.completeTrip(${t.id})" title="Mark trip complete">✓ Done</button>`:''}
            ${t.status==='planned'?`<button class="btn btn-primary btn-sm" onclick="ATLAS.fleet.startTrip(${t.id})" title="Start trip">▶ Start</button>`:''}
            ${t.destination?`<button class="btn btn-secondary btn-sm" onclick="ATLAS.navigation.setDestination('${t.destination.replace(/'/g,'\\\'')}')" title="Navigate to destination">🧭</button>`:''}
          </div>
        </td>
      </tr>`).join('')||`<tr><td colspan="7" style="text-align:center;padding:20px;color:var(--text-muted);">No trips found</td></tr>`;
  },

  _filterTrips(status) {
    if (status) {
      const sel = document.getElementById('trip-status-filter');
      if (sel) sel.value = status;
    }
    const q = (document.getElementById('trip-search')?.value||'').toLowerCase();
    const statusF = document.getElementById('trip-status-filter')?.value||'';
    const filtered = (this._trips||[]).filter(t => {
      if (statusF && t.status !== statusF) return false;
      if (q && !JSON.stringify(t).toLowerCase().includes(q)) return false;
      return true;
    });
    const tbody = document.getElementById('trips-tbody');
    if (tbody) tbody.innerHTML = this._renderTripRows(filtered);
  },

  async startTrip(id) {
    // Find vehicle_id from cached trips so backend can update vehicle status
    const trip = (this._trips || []).find(t => t.id === id);
    await ATLAS.api.put(`/api/fleet/trips/${id}`, {
      status: 'active',
      vehicle_id: trip?.vehicle_id,
    });
    ATLAS.ui.toast('Trip started!', 'success');
    await this.switchTab('trips');
  },

  async completeTrip(id) {
    const trip = (this._trips || []).find(t => t.id === id);
    const vehicle = trip?.vehicle_id ? (this._vehicles || []).find(v => v.id === trip.vehicle_id) : null;
    ATLAS.ui.modal(`✅ ${ATLAS.i18n.t('complete_trip')}: ${trip?.title||'#'+id}`, `
      <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;">
        ${trip?.origin||''}${trip?.origin&&trip?.destination?' → ':''}${trip?.destination||''}
        ${vehicle?`<br>Vehicle: <strong>${vehicle.name}</strong>`:''}
      </p>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">${ATLAS.i18n.t('fuel_used')} (optional)</label>
          <input id="ct-fuel" class="form-input" type="number" step="0.1" min="0" placeholder="e.g. 42.5">
        </div>
        <div class="form-group">
          <label class="form-label">${ATLAS.i18n.t('odometer')} km at end (optional)</label>
          <input id="ct-odo" class="form-input" type="number" step="0.1" value="${vehicle?.odometer_km||''}">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">${ATLAS.i18n.t('completed_notes')} (optional)</label>
        <textarea id="ct-notes" class="form-textarea" rows="3" placeholder="Any notes about the trip..."></textarea>
      </div>
      <div style="display:flex;gap:8px;align-items:center;font-size:12px;color:var(--text-muted);">
        <input type="checkbox" id="ct-use-gps" onchange="ATLAS.fleet._toggleCompleteTripGPS(this.checked)">
        <label for="ct-use-gps" style="cursor:pointer;">Use current GPS position as end location</label>
      </div>
      <div id="ct-gps-status" style="font-size:11px;color:var(--text-muted);margin-top:4px;display:none;"></div>
      <input type="hidden" id="ct-lat"><input type="hidden" id="ct-lng">`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-success" onclick="ATLAS.fleet._doCompleteTrip(${id})">✅ ${ATLAS.i18n.t('complete_trip')}</button>`,
      'modal-lg'
    );
  },

  _toggleCompleteTripGPS(checked) {
    const statusEl = document.getElementById('ct-gps-status');
    if (!checked) { if(statusEl) statusEl.style.display='none'; return; }
    if (statusEl) { statusEl.style.display='block'; statusEl.textContent='📡 Getting GPS position...'; }
    navigator.geolocation?.getCurrentPosition(
      pos => {
        document.getElementById('ct-lat').value = pos.coords.latitude;
        document.getElementById('ct-lng').value = pos.coords.longitude;
        if (statusEl) statusEl.textContent = `✅ GPS: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
      },
      err => {
        if (statusEl) statusEl.textContent = `❌ GPS error: ${err.message}`;
        const chk = document.getElementById('ct-use-gps');
        if (chk) chk.checked = false;
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  },

  async _doCompleteTrip(id) {
    const fuel_used = parseFloat(document.getElementById('ct-fuel')?.value) || 0;
    const end_odometer = parseFloat(document.getElementById('ct-odo')?.value) || null;
    const notes = document.getElementById('ct-notes')?.value || '';
    const lat = parseFloat(document.getElementById('ct-lat')?.value) || null;
    const lng = parseFloat(document.getElementById('ct-lng')?.value) || null;
    const body = { completed_notes: notes };
    if (fuel_used > 0) body.fuel_used_l = fuel_used;
    if (end_odometer) body.end_odometer_km = end_odometer;
    if (lat && lng) { body.end_lat = lat; body.end_lng = lng; }
    await ATLAS.api.post(`/api/fleet/trips/${id}/complete`, body);
    ATLAS.ui.closeModal();
    ATLAS.ui.toast('Trip completed!', 'success');
    await this.switchTab('trips');
    await this.loadStats();
  },

  async renderMaintenance(el) {
    const items = await ATLAS.api.get('/api/fleet/maintenance') || [];
    this._maintenance = items;
    el.innerHTML = `
      <div class="card">
        <div class="table-wrap">
          <table>
            <thead><tr><th>Vehicle</th><th>Type</th><th>Scheduled</th><th>Cost</th><th>Status</th><th></th></tr></thead>
            <tbody>${items.map(m=>`
              <tr>
                <td style="font-weight:600;">${m.vehicle_name||'–'}</td>
                <td>${m.type}</td>
                <td style="color:${m.scheduled_date&&m.scheduled_date<new Date().toISOString().split('T')[0]?'var(--warning)':'inherit'};font-size:12px;">${m.scheduled_date||'–'}</td>
                <td>${m.cost?'€'+m.cost:'–'}</td>
                <td>${ATLAS.ui.statusBadge(m.status)}</td>
                <td><button class="btn btn-secondary btn-sm" onclick="ATLAS.fleet.completeMaintenance(${m.id})">✓ Done</button></td>
              </tr>`).join('')||`<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--text-muted);">No maintenance scheduled</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>`;
  },

  async completeMaintenance(id) {
    await ATLAS.api.put(`/api/fleet/maintenance/${id}`, { status:'completed', completed_date: new Date().toISOString().split('T')[0] });
    ATLAS.ui.toast('Maintenance marked complete', 'success');
    await this.switchTab('maintenance');
  },

  async renderFuel(el) {
    const logs = await ATLAS.api.get('/api/fleet/fuel') || [];
    const total = logs.reduce((s,f)=>s+(f.total_cost||0),0);
    const totalL = logs.reduce((s,f)=>s+(f.liters||0),0);
    const avgPpl = logs.filter(f=>f.cost_per_liter).reduce((s,f,_,a)=>s+f.cost_per_liter/a.length,0);

    // Group cost by vehicle for chart
    const byCar = {};
    logs.forEach(f => { if (f.vehicle_name) { byCar[f.vehicle_name]=(byCar[f.vehicle_name]||0)+(f.total_cost||0); } });
    const carNames = Object.keys(byCar);
    const carCosts = carNames.map(k=>byCar[k]);

    el.innerHTML = `
      <div class="kpi-grid" style="margin-bottom:16px;">
        <div class="kpi-card"><div class="kpi-label">Total Entries</div><div class="kpi-value">${logs.length}</div><div class="kpi-icon">🧾</div></div>
        <div class="kpi-card"><div class="kpi-label">Total Liters</div><div class="kpi-value">${totalL.toFixed(0)} L</div><div class="kpi-icon">⛽</div></div>
        <div class="kpi-card"><div class="kpi-label">Total Cost</div><div class="kpi-value">€${total.toFixed(0)}</div><div class="kpi-icon">💶</div></div>
        <div class="kpi-card"><div class="kpi-label">Avg €/Liter</div><div class="kpi-value">${avgPpl?'€'+avgPpl.toFixed(3):'–'}</div><div class="kpi-icon">📊</div></div>
      </div>
      ${carNames.length > 1 ? `
      <div class="card" style="margin-bottom:16px;">
        <div class="card-title">💶 Fuel Cost by Vehicle</div>
        <div style="height:200px;position:relative;"><canvas id="fuel-chart"></canvas></div>
      </div>` : ''}
      <div class="card">
        <div style="display:flex;gap:8px;margin-bottom:12px;">
          <input class="form-input" style="flex:1;" placeholder="Filter by vehicle or station..." oninput="ATLAS.fleet._filterFuel(this.value)">
          <select class="form-select" style="width:180px;" id="fuel-vehicle-filter" onchange="ATLAS.fleet._filterFuelByVehicle(this.value)">
            <option value="">All vehicles</option>
            ${[...new Set(logs.map(f=>f.vehicle_name).filter(Boolean))].map(n=>`<option value="${n}">${n}</option>`).join('')}
          </select>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Vehicle</th><th>Date</th><th>Liters</th><th>€/L</th><th>Total</th><th>Odometer</th><th>Station</th></tr></thead>
            <tbody id="fuel-tbody">${this._renderFuelRows(logs)}</tbody>
          </table>
        </div>
      </div>`;
    this._fuelLogs = logs;

    // Draw fuel cost chart
    if (carNames.length > 1 && window.Chart) {
      setTimeout(() => {
        const ctx = document.getElementById('fuel-chart');
        if (!ctx) return;
        const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
        const colors = carNames.map((_,i) => `hsl(${(i*47+200)%360},65%,55%)`);
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: carNames,
            datasets: [{ label: 'Fuel Cost (€)', data: carCosts, backgroundColor: colors, borderRadius: 4 }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { ticks: { color: '#888', font:{size:11} }, grid: { color: 'rgba(255,255,255,0.04)' } },
              y: { beginAtZero: true, ticks: { color: '#888', callback: v=>'€'+v }, grid: { color: 'rgba(255,255,255,0.04)' } }
            }
          }
        });
      }, 50);
    }
  },

  _renderFuelRows(logs) {
    return logs.map(f=>`
      <tr>
        <td style="font-weight:600;">${f.vehicle_name||'–'}</td>
        <td style="font-size:12px;">${f.date}</td>
        <td>${f.liters} L</td>
        <td>${f.cost_per_liter?'€'+f.cost_per_liter:'–'}</td>
        <td style="font-weight:600;color:var(--accent);">€${(f.total_cost||0).toFixed(2)}</td>
        <td style="font-size:12px;">${f.odometer_km?.toLocaleString()||'–'} km</td>
        <td style="font-size:12px;">${f.station||'–'}</td>
      </tr>`).join('')||`<tr><td colspan="7" style="text-align:center;padding:20px;color:var(--text-muted);">No fuel logs</td></tr>`;
  },

  _filterFuel(q) {
    const qL = q.toLowerCase();
    const filtered = (this._fuelLogs||[]).filter(f => !qL || JSON.stringify(f).toLowerCase().includes(qL));
    const tbody = document.getElementById('fuel-tbody');
    if (tbody) tbody.innerHTML = this._renderFuelRows(filtered);
  },

  _filterFuelByVehicle(name) {
    const filtered = name ? (this._fuelLogs||[]).filter(f=>f.vehicle_name===name) : (this._fuelLogs||[]);
    const tbody = document.getElementById('fuel-tbody');
    if (tbody) tbody.innerHTML = this._renderFuelRows(filtered);
  },

  renderFleetMap(el) {
    el.innerHTML = `
      <div style="display:flex;gap:12px;margin-bottom:12px;flex-wrap:wrap;align-items:center;">
        <div style="display:flex;gap:6px;">
          <span style="display:inline-flex;align-items:center;gap:4px;font-size:12px;"><span style="width:10px;height:10px;border-radius:50%;background:#10b981;display:inline-block;"></span> Active</span>
          <span style="display:inline-flex;align-items:center;gap:4px;font-size:12px;"><span style="width:10px;height:10px;border-radius:50%;background:#60a5fa;display:inline-block;"></span> Available</span>
          <span style="display:inline-flex;align-items:center;gap:4px;font-size:12px;"><span style="width:10px;height:10px;border-radius:50%;background:#fbbf24;display:inline-block;"></span> Maintenance</span>
          <span style="display:inline-flex;align-items:center;gap:4px;font-size:12px;"><span style="width:10px;height:10px;border-radius:50%;background:#6b7280;display:inline-block;"></span> Out of Service</span>
        </div>
        <div style="margin-left:auto;font-size:12px;color:var(--text-muted);">
          ${this._vehicles.filter(v=>v.lat&&v.lng).length} / ${this._vehicles.length} vehicles with GPS
        </div>
      </div>
      <div class="card" style="padding:0;overflow:hidden;"><div id="fleet-map" style="height:520px;"></div></div>`;

    setTimeout(() => {
      if (!window.L) return;
      const el2 = document.getElementById('fleet-map');
      if (!el2) return;
      // If old map exists but container is gone (page was re-rendered), destroy and recreate
      if (this._fleetMap) {
        if (el2._leaflet_id) { this._fleetMap.invalidateSize(); return; }
        try { this._fleetMap.remove(); } catch(e) {}
        this._fleetMap = null;
      }
      this._fleetMap = L.map('fleet-map').setView([51.1657, 10.4515], 6);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(this._fleetMap);
      ATLAS.state.fleetMapMarkers = {};
      const bounds = [];
      this._vehicles.forEach(v => {
        if (!v.lat || !v.lng) return;
        const color = v.status==='on_trip'?'#10b981':v.status==='maintenance'?'#fbbf24':v.status==='out_of_service'?'#6b7280':'#60a5fa';
        const icon = L.divIcon({
          html:`<div style="background:${color};border:2.5px solid white;border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 8px rgba(0,0,0,0.4);transition:transform 0.2s;" title="${v.name}">${ATLAS.ui.vehicleIcon(v.type)}</div>`,
          iconSize:[34,34], iconAnchor:[17,17], className:''
        });
        const marker = L.marker([v.lat,v.lng],{icon}).addTo(this._fleetMap);
        marker.bindPopup(`
          <div style="min-width:160px;">
            <div style="font-weight:700;font-size:14px;margin-bottom:4px;">${ATLAS.ui.vehicleIcon(v.type)} ${v.name}</div>
            <div style="font-size:12px;color:#888;margin-bottom:6px;">${v.make||''} ${v.model||''} ${v.year?'('+v.year+')':''}</div>
            <div style="font-size:12px;margin-bottom:3px;">🔑 ${v.license_plate||'–'}</div>
            ${v.driver_name?`<div style="font-size:12px;margin-bottom:3px;">👤 ${v.driver_name}</div>`:''}
            <div style="font-size:12px;margin-bottom:6px;">📏 ${(v.odometer_km||0).toLocaleString()} km</div>
            <div style="padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;background:${color}20;color:${color};display:inline-block;">${v.status.replace(/_/g,' ')}</div>
            <div style="margin-top:8px;display:flex;gap:6px;">
              <a href="javascript:void(0)" onclick="ATLAS.fleet.showVehicleDetail(${v.id})" style="font-size:11px;color:#60a5fa;">Detail →</a>
            </div>
          </div>`, { maxWidth: 220 });
        ATLAS.state.fleetMapMarkers[v.id] = marker;
        bounds.push([v.lat, v.lng]);
      });
      if (bounds.length > 0) this._fleetMap.fitBounds(bounds, { padding: [50,50] });
    }, 100);
  },

  showUpdateFuelLevel(vehicleId, currentL, capacityL, avgL100) {
    ATLAS.ui.modal('⛽ Update Fuel Level', `
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">${ATLAS.i18n.t('fuel_current')} (L)</label>
          <input id="ufl-current" class="form-input" type="number" step="0.1" min="0" value="${(currentL||0).toFixed(1)}" placeholder="Current fuel in liters">
        </div>
        <div class="form-group">
          <label class="form-label">${ATLAS.i18n.t('fuel_capacity')} (L)</label>
          <input id="ufl-cap" class="form-input" type="number" step="0.1" min="1" value="${(capacityL||60).toFixed(0)}" placeholder="Tank capacity in liters">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">${ATLAS.i18n.t('fuel_avg')} (optional)</label>
        <input id="ufl-avg" class="form-input" type="number" step="0.1" min="0" value="${(avgL100||10).toFixed(1)}" placeholder="e.g. 10.5">
      </div>
      <div id="ufl-preview" style="font-size:12px;color:var(--text-muted);margin-top:8px;"></div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.fleet._doUpdateFuelLevel(${vehicleId})">💾 ${ATLAS.i18n.t('save')}</button>`
    );
    // Live range preview
    const updatePreview = () => {
      const cur = parseFloat(document.getElementById('ufl-current')?.value)||0;
      const cap = parseFloat(document.getElementById('ufl-cap')?.value)||0;
      const avg = parseFloat(document.getElementById('ufl-avg')?.value)||0;
      const pct = cap > 0 ? Math.round(cur/cap*100) : 0;
      const range = (avg > 0 && cur > 0) ? Math.round(cur/avg*100) : 0;
      const el = document.getElementById('ufl-preview');
      if (el) el.innerHTML = `Fill level: <strong>${pct}%</strong>${range?' · Range: <strong>~'+range+' km</strong>':''}`;
    };
    setTimeout(() => {
      ['ufl-current','ufl-cap','ufl-avg'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updatePreview);
      });
      updatePreview();
    }, 50);
  },

  async _doUpdateFuelLevel(vehicleId) {
    const cur = parseFloat(document.getElementById('ufl-current')?.value);
    const cap = parseFloat(document.getElementById('ufl-cap')?.value);
    const avg = parseFloat(document.getElementById('ufl-avg')?.value)||null;
    if (isNaN(cur) || isNaN(cap)) { ATLAS.ui.toast('Please enter valid values', 'warning'); return; }
    const body = { fuel_current_l: cur, fuel_capacity_l: cap };
    if (avg) body.fuel_avg_l100km = avg;
    await ATLAS.api.put(`/api/fleet/vehicles/${vehicleId}/fuel`, body);
    ATLAS.ui.closeModal();
    ATLAS.ui.closePanel();
    ATLAS.ui.toast('Fuel level updated', 'success');
    await this.switchTab('vehicles');
  },

  showUpdatePosition(vehicleId, currentLat, currentLng) {
    ATLAS.ui.modal('📍 Update Vehicle Position', `
      <div id="upd-gps-status" style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">
        ${currentLat && currentLng ? `Current: ${(+currentLat).toFixed(5)}, ${(+currentLng).toFixed(5)}` : 'No position set'}
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Latitude</label>
          <input id="upd-lat" class="form-input" type="number" step="0.00001" value="${currentLat||''}">
        </div>
        <div class="form-group">
          <label class="form-label">Longitude</label>
          <input id="upd-lng" class="form-input" type="number" step="0.00001" value="${currentLng||''}">
        </div>
      </div>
      <button class="btn btn-secondary btn-sm" style="width:100%;" onclick="ATLAS.fleet._getGPSForPosition()">📡 Use My GPS Position</button>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.fleet._doUpdatePosition(${vehicleId})">💾 ${ATLAS.i18n.t('save')}</button>`
    );
  },

  _getGPSForPosition() {
    const st = document.getElementById('upd-gps-status');
    if (st) st.textContent = '📡 Getting position...';
    navigator.geolocation?.getCurrentPosition(
      pos => {
        const latEl = document.getElementById('upd-lat');
        const lngEl = document.getElementById('upd-lng');
        if (latEl) latEl.value = pos.coords.latitude.toFixed(6);
        if (lngEl) lngEl.value = pos.coords.longitude.toFixed(6);
        if (st) st.textContent = `✅ ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)} (±${Math.round(pos.coords.accuracy)}m)`;
      },
      err => { if (st) st.textContent = `❌ ${err.message}`; },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  },

  async _doUpdatePosition(vehicleId) {
    const lat = parseFloat(document.getElementById('upd-lat')?.value);
    const lng = parseFloat(document.getElementById('upd-lng')?.value);
    if (isNaN(lat) || isNaN(lng)) { ATLAS.ui.toast('Invalid coordinates', 'warning'); return; }
    await ATLAS.api.post(`/api/fleet/vehicles/${vehicleId}/position`, { lat, lng });
    ATLAS.ui.closeModal();
    ATLAS.ui.closePanel();
    ATLAS.ui.toast('Position updated', 'success');
    await this.switchTab('map');
  },

  showAdd() {
    ATLAS.ui.modal(ATLAS.i18n.t('new_vehicle'), `
      <div class="form-row">
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('name')}</label><input id="nv-name" class="form-input" placeholder="Vehicle name"></div>
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('type')}</label>
          <select id="nv-type" class="form-select"><option value="car">Car/PKW</option><option value="van">Van/Transporter</option><option value="bus">Bus</option><option value="truck">Truck</option><option value="aircraft">Aircraft</option><option value="helicopter">Helicopter</option><option value="jet">Jet</option><option value="ship">Ship</option><option value="boat">Boat</option></select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('make')}</label><input id="nv-make" class="form-input" placeholder="Mercedes"></div>
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('model')}</label><input id="nv-model" class="form-input" placeholder="Sprinter"></div>
      </div>
      <div class="form-row col-3">
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('year')}</label><input id="nv-year" class="form-input" type="number" value="${new Date().getFullYear()}"></div>
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('license_plate')}</label><input id="nv-plate" class="form-input"></div>
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('fuel_type')}</label>
          <select id="nv-fuel" class="form-select"><option>diesel</option><option>gasoline</option><option>electric</option><option>hybrid</option><option>avgas</option></select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('insurance_expiry')}</label><input id="nv-ins" class="form-input" type="date"></div>
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('tuev_expiry')}</label><input id="nv-tuev" class="form-input" type="date"></div>
      </div>`, 
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.fleet.createVehicle()">+ ${ATLAS.i18n.t('create')}</button>`, 'modal-lg'
    );
  },

  async createVehicle() {
    const name = document.getElementById('nv-name').value.trim();
    if (!name) return;
    await ATLAS.api.post('/api/fleet/vehicles', {
      name, type: document.getElementById('nv-type').value,
      make: document.getElementById('nv-make').value, model: document.getElementById('nv-model').value,
      year: parseInt(document.getElementById('nv-year').value)||null,
      license_plate: document.getElementById('nv-plate').value,
      fuel_type: document.getElementById('nv-fuel').value,
      insurance_expiry: document.getElementById('nv-ins').value||null,
      tuev_expiry: document.getElementById('nv-tuev').value||null,
      status: 'available',
    });
    ATLAS.ui.closeModal();
    ATLAS.ui.toast(`Vehicle "${name}" added`, 'success');
    await this.loadStats();
    await this.switchTab('vehicles');
  },

  showAddDriver() {
    ATLAS.ui.modal(ATLAS.i18n.t('new_driver'), `
      <div class="form-group"><label class="form-label">${ATLAS.i18n.t('name')}</label><input id="nd-name" class="form-input"></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">License Class</label><input id="nd-lic" class="form-input" placeholder="B,BE,C"></div>
        <div class="form-group"><label class="form-label">License Expiry</label><input id="nd-exp" class="form-input" type="date"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Phone</label><input id="nd-phone" class="form-input"></div>
        <div class="form-group"><label class="form-label">Email</label><input id="nd-email" class="form-input" type="email"></div>
      </div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.fleet.createDriver()">+ ${ATLAS.i18n.t('create')}</button>`
    );
  },

  async createDriver() {
    const name = document.getElementById('nd-name').value.trim();
    if (!name) return;
    await ATLAS.api.post('/api/fleet/drivers', { full_name:name, license_class:document.getElementById('nd-lic').value, license_expiry:document.getElementById('nd-exp').value||null, phone:document.getElementById('nd-phone').value, email:document.getElementById('nd-email').value });
    ATLAS.ui.closeModal(); ATLAS.ui.toast('Driver added','success'); await this.switchTab('drivers');
  },

  showAddTrip() {
    ATLAS.ui.modal(ATLAS.i18n.t('new_trip'), `
      <div class="form-group"><label class="form-label">Trip Title</label><input id="nt-title" class="form-input"></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Vehicle</label>
          <select id="nt-vehicle" class="form-select"><option value="">– select –</option>${this._vehicles.map(v=>`<option value="${v.id}">${v.name}</option>`).join('')}</select>
        </div>
        <div class="form-group"><label class="form-label">Driver</label>
          <select id="nt-driver" class="form-select"><option value="">– optional –</option>${this._drivers.map(d=>`<option value="${d.id}">${d.full_name}</option>`).join('')}</select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Origin</label><input id="nt-origin" class="form-input" placeholder="City or address"></div>
        <div class="form-group"><label class="form-label">Destination</label><input id="nt-dest" class="form-input" placeholder="City or address"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Departure</label><input id="nt-dep" class="form-input" type="datetime-local"></div>
        <div class="form-group"><label class="form-label">Est. Arrival</label><input id="nt-arr" class="form-input" type="datetime-local"></div>
      </div>
      <div class="form-group"><label class="form-label">Distance (km)</label><input id="nt-dist" class="form-input" type="number"></div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.fleet.createTrip()">+ ${ATLAS.i18n.t('create')}</button>`, 'modal-lg'
    );
  },

  async createTrip() {
    const title = document.getElementById('nt-title').value.trim();
    const vid = document.getElementById('nt-vehicle').value;
    if (!title || !vid) { ATLAS.ui.toast('Title and vehicle required','warning'); return; }
    await ATLAS.api.post('/api/fleet/trips', { title, vehicle_id:parseInt(vid), driver_id:parseInt(document.getElementById('nt-driver').value)||null, origin:document.getElementById('nt-origin').value, destination:document.getElementById('nt-dest').value, departure_time:document.getElementById('nt-dep').value||null, estimated_arrival:document.getElementById('nt-arr').value||null, distance_km:parseFloat(document.getElementById('nt-dist').value)||null });
    ATLAS.ui.closeModal(); ATLAS.ui.toast('Trip created','success'); await this.switchTab('trips');
  },

  showAddMaintenance() {
    ATLAS.ui.modal(ATLAS.i18n.t('new_maintenance'), `
      <div class="form-group"><label class="form-label">Vehicle</label>
        <select id="nm-vehicle" class="form-select"><option value="">– select –</option>${this._vehicles.map(v=>`<option value="${v.id}">${v.name}</option>`).join('')}</select>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Type</label>
          <select id="nm-type" class="form-select"><option>oil_change</option><option>tire_change</option><option>tuev</option><option>brake_inspection</option><option>general</option></select>
        </div>
        <div class="form-group"><label class="form-label">Scheduled Date</label><input id="nm-date" class="form-input" type="date"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Cost (€)</label><input id="nm-cost" class="form-input" type="number"></div>
        <div class="form-group"><label class="form-label">Technician</label><input id="nm-tech" class="form-input"></div>
      </div>
      <div class="form-group"><label class="form-label">Notes</label><textarea id="nm-notes" class="form-textarea"></textarea></div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.fleet.createMaintenance()">+ ${ATLAS.i18n.t('create')}</button>`
    );
  },

  async createMaintenance() {
    const vid = document.getElementById('nm-vehicle').value;
    if (!vid) return;
    await ATLAS.api.post('/api/fleet/maintenance', { vehicle_id:parseInt(vid), type:document.getElementById('nm-type').value, scheduled_date:document.getElementById('nm-date').value||null, cost:parseFloat(document.getElementById('nm-cost').value)||null, technician:document.getElementById('nm-tech').value, notes:document.getElementById('nm-notes').value });
    ATLAS.ui.closeModal(); ATLAS.ui.toast('Maintenance scheduled','success'); await this.switchTab('maintenance');
  },

  showAddFuel() {
    ATLAS.ui.modal(ATLAS.i18n.t('add_fuel'), `
      <div class="form-group"><label class="form-label">Vehicle</label>
        <select id="nf-vehicle" class="form-select"><option value="">– select –</option>${this._vehicles.map(v=>`<option value="${v.id}">${v.name}</option>`).join('')}</select>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Date</label><input id="nf-date" class="form-input" type="date" value="${new Date().toISOString().split('T')[0]}"></div>
        <div class="form-group"><label class="form-label">Liters</label><input id="nf-liters" class="form-input" type="number" step="0.1"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">€/Liter</label><input id="nf-ppl" class="form-input" type="number" step="0.001"></div>
        <div class="form-group"><label class="form-label">Odometer (km)</label><input id="nf-odo" class="form-input" type="number"></div>
      </div>
      <div class="form-group"><label class="form-label">Station</label><input id="nf-station" class="form-input"></div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.fleet.createFuel()">+ Add</button>`
    );
  },

  async createFuel() {
    const vid = document.getElementById('nf-vehicle').value;
    const liters = parseFloat(document.getElementById('nf-liters').value);
    if (!vid || !liters) return;
    const ppl = parseFloat(document.getElementById('nf-ppl').value)||0;
    await ATLAS.api.post('/api/fleet/fuel', { vehicle_id:parseInt(vid), date:document.getElementById('nf-date').value, liters, cost_per_liter:ppl||null, total_cost:ppl*liters||null, odometer_km:parseFloat(document.getElementById('nf-odo').value)||null, station:document.getElementById('nf-station').value });
    ATLAS.ui.closeModal(); ATLAS.ui.toast('Fuel log added','success'); await this.switchTab('fuel');
  },

  showEditVehicle(id) {
    const v = this._vehicles.find(v => v.id === id);
    if (!v) { ATLAS.ui.toast('Vehicle not found', 'warning'); return; }
    ATLAS.ui.modal(`Edit: ${v.name}`, `
      <div class="form-row">
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('name')}</label><input id="ev-name" class="form-input" value="${v.name||''}"></div>
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('status')}</label>
          <select id="ev-status" class="form-select">
            <option value="available" ${v.status==='available'?'selected':''}>Available</option>
            <option value="on_trip" ${v.status==='on_trip'?'selected':''}>On Trip</option>
            <option value="maintenance" ${v.status==='maintenance'?'selected':''}>Maintenance</option>
            <option value="out_of_service" ${v.status==='out_of_service'?'selected':''}>Out of Service</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('make')}</label><input id="ev-make" class="form-input" value="${v.make||''}"></div>
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('model')}</label><input id="ev-model" class="form-input" value="${v.model||''}"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('license_plate')}</label><input id="ev-plate" class="form-input" value="${v.license_plate||''}"></div>
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('odometer')}</label><input id="ev-odo" class="form-input" type="number" value="${v.odometer_km||0}"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('tuev_expiry')}</label><input id="ev-tuev" class="form-input" type="date" value="${v.tuev_expiry||''}"></div>
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('insurance_expiry')}</label><input id="ev-ins" class="form-input" type="date" value="${v.insurance_expiry||''}"></div>
      </div>
      <div class="divider"></div>
      <div style="font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:0.5px;margin-bottom:8px;">⛽ FUEL / ENERGY</div>
      <div class="form-row col-3">
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('fuel_capacity')} (L)</label><input id="ev-fcap" class="form-input" type="number" step="0.1" value="${v.fuel_capacity_l||60}"></div>
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('fuel_current')} (L)</label><input id="ev-fcur" class="form-input" type="number" step="0.1" min="0" value="${v.fuel_current_l||0}"></div>
        <div class="form-group"><label class="form-label">${ATLAS.i18n.t('fuel_avg')} (L/100km)</label><input id="ev-favg" class="form-input" type="number" step="0.1" min="0" value="${v.fuel_avg_l100km||10}"></div>
      </div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.fleet.updateVehicle(${v.id})">${ATLAS.i18n.t('save')}</button>`,
      'modal-lg'
    );
  },

  async updateVehicle(id) {
    const body = {
      name: document.getElementById('ev-name').value,
      status: document.getElementById('ev-status').value,
      make: document.getElementById('ev-make').value,
      model: document.getElementById('ev-model').value,
      license_plate: document.getElementById('ev-plate').value,
      odometer_km: parseFloat(document.getElementById('ev-odo').value)||0,
      tuev_expiry: document.getElementById('ev-tuev').value||null,
      insurance_expiry: document.getElementById('ev-ins').value||null,
    };
    // Fuel fields (optional — only set if present in DOM)
    const fcap = document.getElementById('ev-fcap');
    const fcur = document.getElementById('ev-fcur');
    const favg = document.getElementById('ev-favg');
    if (fcap) body.fuel_capacity_l = parseFloat(fcap.value)||null;
    if (fcur) body.fuel_current_l = parseFloat(fcur.value)||0;
    if (favg) body.fuel_avg_l100km = parseFloat(favg.value)||null;
    await ATLAS.api.put(`/api/fleet/vehicles/${id}`, body);
    // Also update fuel-specific fields via the fuel endpoint if provided
    if (fcap || fcur || favg) {
      const fuelBody = {};
      if (fcap && parseFloat(fcap.value)) fuelBody.fuel_capacity_l = parseFloat(fcap.value);
      if (fcur) fuelBody.fuel_current_l = parseFloat(fcur.value)||0;
      if (favg && parseFloat(favg.value)) fuelBody.fuel_avg_l100km = parseFloat(favg.value);
      if (Object.keys(fuelBody).length) {
        await ATLAS.api.put(`/api/fleet/vehicles/${id}/fuel`, fuelBody).catch(()=>{});
      }
    }
    ATLAS.ui.closePanel();
    ATLAS.ui.closeModal();
    ATLAS.ui.toast('Vehicle updated', 'success');
    await this.switchTab('vehicles');
  },

  showEditDriver(d) {
    ATLAS.ui.modal(`Edit: ${d.full_name}`, `
      <div class="form-group"><label class="form-label">${ATLAS.i18n.t('name')}</label><input id="ed-name" class="form-input" value="${d.full_name||''}"></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">License Class</label><input id="ed-lic" class="form-input" value="${d.license_class||''}"></div>
        <div class="form-group"><label class="form-label">License Expiry</label><input id="ed-exp" class="form-input" type="date" value="${d.license_expiry||''}"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Phone</label><input id="ed-phone" class="form-input" value="${d.phone||''}"></div>
        <div class="form-group"><label class="form-label">Status</label>
          <select id="ed-status" class="form-select">
            <option value="available" ${d.status==='available'?'selected':''}>Available</option>
            <option value="on_trip" ${d.status==='on_trip'?'selected':''}>On Trip</option>
            <option value="inactive" ${d.status==='inactive'?'selected':''}>Inactive</option>
          </select>
        </div>
      </div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.fleet.updateDriver(${d.id})">${ATLAS.i18n.t('save')}</button>`
    );
  },

  async updateDriver(id) {
    await ATLAS.api.put(`/api/fleet/drivers/${id}`, {
      full_name: document.getElementById('ed-name').value,
      license_class: document.getElementById('ed-lic').value,
      license_expiry: document.getElementById('ed-exp').value||null,
      phone: document.getElementById('ed-phone').value,
      status: document.getElementById('ed-status').value,
    });
    ATLAS.ui.closeModal();
    ATLAS.ui.toast('Driver updated', 'success');
    await this.switchTab('drivers');
  },
};


/* ============================================================
   Navigation (Turn-by-Turn)
============================================================ */
ATLAS.navigation = {
  map: null, routeLayer: null, posMarker: null, startMarker: null, endMarker: null,
  steps: [], routeCoords: [], currentStep: 0, watchId: null,
  synth: window.speechSynthesis,
  voiceEnabled: true,
  _active: false,
  _fromCoords: null, _toCoords: null, _currentMode: 'driving-car',

  setDestination(dest) {
    ATLAS.state.navDestAddress = dest;
    ATLAS.router.go('navigation');
  },

  render(el) {
    el.innerHTML = `
      <div class="page-header"><h1>🧭 ${ATLAS.i18n.t('navigation')}</h1></div>
      <div class="grid-2" style="margin-bottom:16px;">
        <div class="card">
          <div class="form-group">
            <label class="form-label">🚀 ${ATLAS.i18n.t('origin')}</label>
            <div style="display:flex;gap:8px;">
              <input id="nav-from" class="form-input" placeholder="Address or coordinates..." value="">
              <button class="btn btn-secondary" onclick="ATLAS.navigation.useGPS()" title="Use my GPS location" data-tooltip="Use GPS">📍</button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">🏁 ${ATLAS.i18n.t('destination')}</label>
            <input id="nav-to" class="form-input" placeholder="Destination address..." value="${ATLAS.state.navDestAddress||''}">
          </div>
          <div class="form-group">
            <label class="form-label">Transport Mode</label>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button class="btn btn-secondary btn-sm" id="mode-car" onclick="ATLAS.navigation.setMode('driving-car')" style="flex:1;min-width:60px;">🚗 ${ATLAS.i18n.t('by_car')}</button>
              <button class="btn btn-secondary btn-sm" id="mode-bike" onclick="ATLAS.navigation.setMode('cycling-regular')" style="flex:1;min-width:60px;">🚲 ${ATLAS.i18n.t('by_bike')}</button>
              <button class="btn btn-secondary btn-sm" id="mode-foot" onclick="ATLAS.navigation.setMode('foot-walking')" style="flex:1;min-width:60px;">🚶 ${ATLAS.i18n.t('on_foot')}</button>
              <button class="btn btn-secondary btn-sm" id="mode-flight" onclick="ATLAS.navigation.setMode('flight')" style="flex:1;min-width:60px;">✈️ ${ATLAS.i18n.t('flight_mode')}</button>
              <button class="btn btn-secondary btn-sm" id="mode-boat" onclick="ATLAS.navigation.setMode('boat')" style="flex:1;min-width:60px;">⛵ ${ATLAS.i18n.t('boat_mode')}</button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">${ATLAS.i18n.t('map_layer')}</label>
            <select id="nav-layer" class="form-select" onchange="ATLAS.navigation.switchNavLayer(this.value)">
              <option value="osm">${ATLAS.i18n.t('map_osm')}</option>
              <option value="satellite">${ATLAS.i18n.t('map_satellite')}</option>
              <option value="topo">${ATLAS.i18n.t('map_topo')}</option>
              <option value="dark">${ATLAS.i18n.t('map_dark')}</option>
              <option value="water">⚓ ${ATLAS.i18n.t('map_water')}</option>
            </select>
          </div>
          <input type="hidden" id="nav-mode" value="driving-car">
          <div style="display:flex;gap:8px;margin-bottom:12px;">
            <button class="btn btn-primary" style="flex:1;" onclick="ATLAS.navigation.startRoute()" id="nav-start-btn">▶ ${ATLAS.i18n.t('start_navigation')}</button>
            <button class="btn btn-secondary" id="nav-recalc-btn" onclick="ATLAS.navigation.recalculate()" style="display:none;" title="Recalculate">🔄</button>
            <button class="btn btn-secondary" id="nav-voice-btn" onclick="ATLAS.navigation.toggleVoice()" title="Toggle voice" data-tooltip="Voice: On">🔊</button>
          </div>
          <button class="btn btn-danger w-full hidden" id="nav-stop-btn" onclick="ATLAS.navigation.stopNav()">⏹ Stop Navigation</button>
          <div id="nav-error" class="hidden" style="color:var(--danger);font-size:12px;margin-top:8px;padding:8px;background:var(--danger)18;border-radius:var(--radius-sm);"></div>
        </div>
        <div class="card" style="display:flex;flex-direction:column;gap:12px;">
          <div id="nav-instruction" class="nav-instruction-card hidden">
            <div class="nav-arrow" id="nav-arrow">↑</div>
            <div class="nav-instruction-text" id="nav-instr-text">Calculating route…</div>
            <div class="nav-distance" id="nav-instr-dist"></div>
          </div>
          <div id="nav-summary" class="hidden" style="display:flex;gap:16px;font-size:13px;flex-wrap:wrap;">
            <div style="flex:1;min-width:80px;background:var(--bg-input);padding:10px 12px;border-radius:var(--radius-sm);">
              <div style="color:var(--text-muted);font-size:10px;margin-bottom:2px;">⏱ ${ATLAS.i18n.t('eta')}</div>
              <div id="nav-eta" style="font-weight:700;font-size:16px;">–</div>
            </div>
            <div style="flex:1;min-width:80px;background:var(--bg-input);padding:10px 12px;border-radius:var(--radius-sm);">
              <div style="color:var(--text-muted);font-size:10px;margin-bottom:2px;">📏 ${ATLAS.i18n.t('total_distance')}</div>
              <div id="nav-total-dist" style="font-weight:700;font-size:16px;">–</div>
            </div>
            <div style="flex:1;min-width:80px;background:var(--bg-input);padding:10px 12px;border-radius:var(--radius-sm);">
              <div style="color:var(--text-muted);font-size:10px;margin-bottom:2px;">🔢 Step</div>
              <div id="nav-step-counter" style="font-weight:700;font-size:16px;">–</div>
            </div>
          </div>
          <div class="divider" id="nav-steps-divider" style="display:none;margin:0;"></div>
          <div class="nav-step-list" id="nav-steps" style="flex:1;overflow-y:auto;max-height:240px;"></div>
        </div>
      </div>
      <div class="card" style="padding:0;overflow:hidden;"><div id="nav-map" style="height:460px;"></div></div>`;

    setTimeout(() => this.initMap(), 80);
    // Pre-fill destination from address or coordinates (e.g. from fleet "Navigate" button)
    if (ATLAS.state.navDestAddress) {
      document.getElementById('nav-to').value = ATLAS.state.navDestAddress;
      delete ATLAS.state.navDestAddress;
    } else if (ATLAS.state.navDestLat && ATLAS.state.navDestLng) {
      // Coordinates from fleet map – pre-fill the destination field.
      // geocode() can parse "lat, lng" strings directly so this will work in startRoute().
      const lat = ATLAS.state.navDestLat;
      const lng = ATLAS.state.navDestLng;
      document.getElementById('nav-to').value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      delete ATLAS.state.navDestLat;
      delete ATLAS.state.navDestLng;
    }
    this.setMode('driving-car');
    this.updateVoiceBtn();
  },

  _navTileLayerRef: { layer: null },

  switchNavLayer(layerId) {
    if (!this.map) return;
    if (layerId === 'water') {
      // Water/seamark is an overlay — use OSM as base + seamark on top
      ATLAS._switchTileLayer(this.map, 'osm', this._navTileLayerRef);
      if (this._waterOverlay) { try { this.map.removeLayer(this._waterOverlay); } catch(e) {} }
      this._waterOverlay = ATLAS._createTileLayer('water');
      this._waterOverlay.addTo(this.map);
    } else {
      // Remove overlay if switching away from water
      if (this._waterOverlay) {
        try { this.map.removeLayer(this._waterOverlay); } catch(e) {}
        this._waterOverlay = null;
      }
      ATLAS._switchTileLayer(this.map, layerId, this._navTileLayerRef);
    }
  },

  setMode(mode) {
    this._currentMode = mode;
    document.getElementById('nav-mode').value = mode;
    const modeIds = ['car', 'bike', 'foot', 'flight', 'boat'];
    const modeVals = {'driving-car':'car','cycling-regular':'bike','foot-walking':'foot','flight':'flight','boat':'boat'};
    modeIds.forEach(k => {
      const btn = document.getElementById('mode-'+k);
      if (btn) btn.className = `btn btn-sm ${modeVals[mode]===k?'btn-primary':'btn-secondary'}`;
    });
    // Auto-switch to water layer for boat mode
    if (mode === 'boat') {
      const sel = document.getElementById('nav-layer');
      if (sel) { sel.value = 'water'; this.switchNavLayer('water'); }
    }
  },

  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    this.updateVoiceBtn();
    ATLAS.ui.toast(`Voice ${this.voiceEnabled?'enabled':'disabled'}`, 'info');
  },

  updateVoiceBtn() {
    const btn = document.getElementById('nav-voice-btn');
    if (btn) { btn.textContent = this.voiceEnabled ? '🔊' : '🔇'; btn.title = `Voice: ${this.voiceEnabled?'On':'Off'}`; }
  },

  initMap() {
    if (!window.L) { setTimeout(()=>this.initMap(),200); return; }
    const el = document.getElementById('nav-map');
    if (!el) return;
    // Handle stale map instance when page is re-rendered
    if (this.map) {
      if (el._leaflet_id) { this.map.invalidateSize(); return; }
      try { this.map.remove(); } catch(e) {}
      this.map = null; this.routeLayer = null;
      this.posMarker = null; this.startMarker = null; this.endMarker = null;
    }
    this.map = L.map('nav-map').setView([51.1657, 10.4515], 7);
    this._navTileLayerRef.layer = ATLAS._createTileLayer('osm');
    this._navTileLayerRef.layer.addTo(this.map);
  },

  useGPS() {
    if (!navigator.geolocation) {
      ATLAS.ui.toast('GPS not available on this device', 'warning');
      return;
    }
    const btn = document.querySelector('[onclick="ATLAS.navigation.useGPS()"]');
    if (btn) btn.textContent = '⏳';
    // Check permission state first if API is available
    const doGet = () => {
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        document.getElementById('nav-from').value = `${lat.toFixed(6)},${lng.toFixed(6)}`;
        if (this.map) this.map.setView([lat, lng], 14);
        ATLAS.ui.toast('GPS location obtained', 'success');
        if (btn) btn.textContent = '📍';
      }, err => {
        if (err.code === 1) {
          ATLAS.ui.toast('GPS permission denied. Please enable location in browser settings.', 'warning');
        } else if (err.code === 2) {
          ATLAS.ui.toast('GPS position unavailable. Check device location settings.', 'warning');
        } else {
          ATLAS.ui.toast('GPS timeout. Try again or enter coordinates manually.', 'warning');
        }
        if (btn) btn.textContent = '📍';
      }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
    };
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        if (result.state === 'denied') {
          ATLAS.ui.toast('GPS permission denied. Please allow location access in browser settings.', 'warning');
          if (btn) btn.textContent = '📍';
        } else {
          doGet();
        }
      }).catch(doGet);
    } else {
      doGet();
    }
  },

  async startRoute() {
    const from = document.getElementById('nav-from').value.trim();
    const to = document.getElementById('nav-to').value.trim();
    const mode = document.getElementById('nav-mode').value;
    const errEl = document.getElementById('nav-error');
    errEl.classList.add('hidden');

    if (!from || !to) {
      errEl.textContent = 'Please fill in both origin and destination';
      errEl.classList.remove('hidden');
      return;
    }

    const startBtn = document.getElementById('nav-start-btn');
    if (startBtn) { startBtn.disabled = true; startBtn.textContent = '⏳ Calculating…'; }

    try {
      const [fromCoords, toCoords] = await Promise.all([this.geocode(from), this.geocode(to)]);
      if (!fromCoords) throw new Error(`Could not locate "${from}"`);
      if (!toCoords) throw new Error(`Could not locate "${to}"`);
      this._fromCoords = fromCoords;
      this._toCoords = toCoords;
      await this._fetchAndDraw(fromCoords, toCoords, mode);
    } catch(e) {
      errEl.textContent = '⚠ ' + e.message;
      errEl.classList.remove('hidden');
    } finally {
      if (startBtn) { startBtn.disabled = false; startBtn.textContent = '▶ ' + ATLAS.i18n.t('start_navigation'); }
    }
  },

  async recalculate() {
    if (!this._fromCoords || !this._toCoords) return;
    ATLAS.ui.toast(ATLAS.i18n.t('recalculating'), 'info');
    await this._fetchAndDraw(this._fromCoords, this._toCoords, this._currentMode);
  },

  async _fetchAndDraw(fromCoords, toCoords, mode) {
    // fromCoords / toCoords are [lat, lng]
    // ORS expects  start=lng,lat  end=lng,lat
    const lng0 = fromCoords[1], lat0 = fromCoords[0];
    const lng1 = toCoords[1],   lat1 = toCoords[0];

    let route = null;

    // ── Flight/Boat mode: straight-line great circle route ────────────────
    if (mode === 'flight' || mode === 'boat') {
      const dist = this.haversine(lat0, lng0, lat1, lng1);
      const speed = mode === 'flight' ? 850 : 20; // km/h
      const duration = (dist / speed) * 3600;
      // Build a simple straight-line "route"
      route = {
        features: [{
          geometry: { type: 'LineString', coordinates: [[lng0,lat0],[lng1,lat1]] },
          properties: {
            summary: { distance: dist * 1000, duration },
            segments: [{ steps: [
              { instruction: `${mode==='flight'?'✈️':'⛵'} Direct ${mode} route`, distance: dist*1000, duration, type: 1, way_points:[0,1] },
              { instruction: `Destination reached`, distance: 0, duration: 0, type: 10, way_points:[1,1] }
            ]}]
          }
        }]
      };
      this._drawRoute(route, fromCoords, toCoords);
      return;
    }

    // ── 1. Try OpenRouteService (GeoJSON directions) ──────────────────────
    try {
      const orsMode = mode || 'driving-car';
      const orsUrl = `https://api.openrouteservice.org/v2/directions/${orsMode}?api_key=5b3ce3597851110001cf6248a10d1a5d21e744d5b2de3e8b41e41c41&start=${lng0},${lat0}&end=${lng1},${lat1}`;
      const res = await fetch(orsUrl, { signal: AbortSignal.timeout(10000) });
      if (res.ok) {
        const json = await res.json();
        if (json?.features?.length) route = json;
        else console.warn('[Nav] ORS returned empty features:', json);
      } else {
        console.warn('[Nav] ORS HTTP', res.status, await res.text().catch(()=>''));
      }
    } catch(e) { console.warn('[Nav] ORS failed:', e.message); }

    // ── 2. Fallback: OSRM (no key required, open routing) ────────────────
    if (!route) {
      try {
        const osrmProfile = mode === 'cycling-regular' ? 'bike' : mode === 'foot-walking' ? 'foot' : 'car';
        const osrmUrl = `https://router.project-osrm.org/route/v1/${osrmProfile}/${lng0},${lat0};${lng1},${lat1}?overview=full&geometries=geojson&steps=true`;
        const res = await fetch(osrmUrl, { signal: AbortSignal.timeout(10000) });
        if (res.ok) {
          const json = await res.json();
          if (json.code === 'Ok' && json.routes?.length) {
            // Normalize OSRM response to ORS-like format
            const leg = json.routes[0].legs[0];
            route = {
              features: [{
                geometry: json.routes[0].geometry, // already GeoJSON LineString
                properties: {
                  summary: {
                    distance: json.routes[0].distance,
                    duration: json.routes[0].duration,
                  },
                  segments: [{
                    steps: (leg.steps || []).map(s => ({
                      distance: s.distance,
                      duration: s.duration,
                      instruction: s.maneuver?.type
                        ? this._osrmInstruction(s.maneuver.type, s.maneuver.modifier, s.name)
                        : (s.name || 'Continue'),
                      type: this._osrmStepType(s.maneuver?.type),
                      way_points: s.intersections?.flatMap(i => i.location ? [0] : []) || [0, 1],
                    }))
                  }]
                }
              }],
              _osrm: true, // flag so geometry mapping works
            };
          }
        }
      } catch(e) { console.warn('[Nav] OSRM failed:', e.message); }
    }

    if (!route?.features?.length) {
      this.drawStraightLine(fromCoords, toCoords);
      return;
    }

    this._drawRoute(route, fromCoords, toCoords);
  },

  _drawRoute(route, fromCoords, toCoords) {
    const feature = route.features[0];
    // ORS: coordinates are [lng, lat] arrays → convert to [lat, lng] for Leaflet
    // OSRM: geometry is a GeoJSON LineString with [lng, lat] coordinates
    const rawCoords = feature.geometry?.coordinates || [];
    this.routeCoords = rawCoords.map(c => [c[1], c[0]]); // [lng,lat] → [lat,lng]
    const summary  = feature.properties.summary;
    const segments = feature.properties.segments || [];
    this.steps = segments.flatMap(s => s.steps || []);

    // Draw route
    if (this.routeLayer) this.map.removeLayer(this.routeLayer);
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#60a5fa';
    this.routeLayer = L.polyline(this.routeCoords, { color: accent, weight: 6, opacity: 0.85, dashArray: '8,4', lineCap: 'round' }).addTo(this.map);
    this.map.fitBounds(this.routeLayer.getBounds(), { padding: [50,50] });

    // Place / update markers
    const startIcon = L.divIcon({html:'<div style="background:#10b981;border:3px solid white;border-radius:50%;width:18px;height:18px;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>',iconSize:[18,18],iconAnchor:[9,9],className:''});
    const endIcon = L.divIcon({html:'<div style="background:#ef4444;border:3px solid white;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:11px;box-shadow:0 2px 6px rgba(0,0,0,0.4);">🏁</div>',iconSize:[22,22],iconAnchor:[11,11],className:''});
    if (this.startMarker) this.map.removeLayer(this.startMarker);
    if (this.endMarker) this.map.removeLayer(this.endMarker);
    this.startMarker = L.marker(fromCoords, {icon:startIcon}).addTo(this.map).bindPopup('Start');
    this.endMarker = L.marker(toCoords, {icon:endIcon}).addTo(this.map).bindPopup('Destination');

    // Update summary
    const distKm = (summary.distance/1000).toFixed(1);
    const durationMin = Math.round(summary.duration/60);
    const eta = new Date(Date.now() + summary.duration*1000);
    document.getElementById('nav-total-dist').textContent = distKm + ' km';
    document.getElementById('nav-eta').textContent = eta.toLocaleTimeString(ATLAS.i18n.lang,{hour:'2-digit',minute:'2-digit'});
    document.getElementById('nav-summary').classList.remove('hidden');
    document.getElementById('nav-steps-divider').style.display = '';
    document.getElementById('nav-stop-btn').classList.remove('hidden');
    document.getElementById('nav-recalc-btn').style.display = '';

    this.currentStep = 0;
    this._active = true;
    this.renderSteps();
    this.updateInstruction();
    this.startGPSTracking();
    ATLAS.ui.toast(`Route: ${distKm} km, ~${durationMin} min`, 'success');
  },

  async geocode(query) {
    // Coords: "lat,lng" or "lat, lng"
    const m = query.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
    if (m) return [parseFloat(m[1]), parseFloat(m[2])];
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=3&addressdetails=1`, {
        headers: { 'Accept-Language': ATLAS.i18n.lang }
      });
      const data = await res.json();
      if (data.length) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    } catch {}
    return null;
  },

  // ── OSRM maneuver type → ORS-style step type number ─────────────────────
  _osrmStepType(maneuver) {
    const map = { 'turn': 0, 'new name': 1, 'depart': 11, 'arrive': 10,
                  'merge': 0, 'ramp': 0, 'fork': 0, 'roundabout': 6 };
    return map[maneuver] ?? 0;
  },

  // ── OSRM maneuver → human instruction ────────────────────────────────────
  _osrmInstruction(type, modifier, streetName) {
    const street = streetName ? ` onto ${streetName}` : '';
    if (type === 'depart') return `Head ${modifier || 'forward'}${street}`;
    if (type === 'arrive') return 'You have arrived at your destination';
    if (type === 'turn') {
      if (modifier === 'left')       return `Turn left${street}`;
      if (modifier === 'right')      return `Turn right${street}`;
      if (modifier === 'slight left')  return `Slight left${street}`;
      if (modifier === 'slight right') return `Slight right${street}`;
      if (modifier === 'sharp left')   return `Sharp left${street}`;
      if (modifier === 'sharp right')  return `Sharp right${street}`;
      if (modifier === 'uturn')        return 'Make a U-turn';
    }
    if (type === 'roundabout')  return `Enter roundabout${street}`;
    if (type === 'fork')        return `Keep ${modifier || 'straight'}${street}`;
    if (type === 'merge')       return `Merge${street}`;
    if (type === 'new name')    return `Continue${street}`;
    return `Continue${street}`;
  },

  drawStraightLine(from, to) {
    if (this.routeLayer) this.map.removeLayer(this.routeLayer);
    this.routeLayer = L.polyline([from, to], { color:'#60a5fa', weight:4, dashArray:'12,8', opacity:0.7 }).addTo(this.map);
    this.map.fitBounds(this.routeLayer.getBounds(), {padding:[40,40]});
    // Place start/end markers even in fallback mode
    const startIcon = L.divIcon({html:'<div style="background:#10b981;border:3px solid white;border-radius:50%;width:16px;height:16px;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>',iconSize:[16,16],iconAnchor:[8,8],className:''});
    const endIcon   = L.divIcon({html:'<div style="background:#ef4444;border:3px solid white;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:10px;box-shadow:0 2px 6px rgba(0,0,0,0.4);">🏁</div>',iconSize:[20,20],iconAnchor:[10,10],className:''});
    if (this.startMarker) this.map.removeLayer(this.startMarker);
    if (this.endMarker)   this.map.removeLayer(this.endMarker);
    this.startMarker = L.marker(from, {icon:startIcon}).addTo(this.map).bindPopup('Start');
    this.endMarker   = L.marker(to,   {icon:endIcon}).addTo(this.map).bindPopup('Destination');
    const dist = (this.haversine(from[0],from[1],to[0],to[1])/1000).toFixed(1);
    ATLAS.ui.toast(`⚠ Routing-Service nicht erreichbar – Luftlinie (${dist} km)`, 'warning');
    document.getElementById('nav-summary').classList.remove('hidden');
    document.getElementById('nav-total-dist').textContent = dist + ' km (Luftlinie)';
    document.getElementById('nav-eta').textContent = '–';
    document.getElementById('nav-stop-btn').classList.remove('hidden');
    // Init step state so GPS tracking still works with straight-line fallback
    this.steps = []; this.currentStep = 0; this._active = true;
    this.renderSteps(); this.updateInstruction();
  },

  haversine(lat1,lon1,lat2,lon2) {
    const R=6371000, dLat=(lat2-lat1)*Math.PI/180, dLon=(lon2-lon1)*Math.PI/180;
    const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
    return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
  },

  renderSteps() {
    const el = document.getElementById('nav-steps');
    if (!el) return;
    const arrows = { 0:'↑', 1:'↗', 2:'→', 3:'↘', 4:'↓', 5:'↙', 6:'←', 7:'↖', 8:'⟳', 9:'⟲', 10:'↑', 11:'↕', 12:'↕', 13:'🏁' };
    el.innerHTML = this.steps.map((s,i) => `
      <div class="nav-step ${i===this.currentStep?'current':''}" id="nav-step-${i}" onclick="ATLAS.navigation.jumpToStep(${i})" style="cursor:pointer;">
        <span class="nav-step-arrow">${arrows[s.type]||'↑'}</span>
        <span style="flex:1;">${s.instruction||s.name||'Continue'}</span>
        <span class="nav-step-dist">${s.distance ? (s.distance >= 1000 ? (s.distance/1000).toFixed(1)+' km' : s.distance.toFixed(0)+'m') : ''}</span>
      </div>`).join('');
    const counterEl = document.getElementById('nav-step-counter');
    if (counterEl) counterEl.textContent = `${this.currentStep+1}/${this.steps.length}`;
  },

  jumpToStep(i) {
    this.currentStep = i;
    this.renderSteps();
    this.updateInstruction(false); // no voice on manual jump
  },

  updateInstruction(speak=true) {
    if (!this.steps.length) return;
    const step = this.steps[Math.min(this.currentStep, this.steps.length-1)];
    const instrEl = document.getElementById('nav-instr-text');
    const distEl = document.getElementById('nav-instr-dist');
    const arrowEl = document.getElementById('nav-arrow');
    const instrCard = document.getElementById('nav-instruction');
    if (!instrEl) return;
    instrCard?.classList.remove('hidden');
    const arrows = { 0:'↑', 1:'↗', 2:'→', 3:'↘', 4:'↓', 5:'↙', 6:'←', 7:'↖', 8:'⟳', 9:'⟲', 13:'🏁' };
    if (arrowEl) arrowEl.textContent = arrows[step.type]||'↑';
    instrEl.textContent = step.instruction||step.name||'Continue';
    distEl.textContent = step.distance
      ? (step.distance >= 1000 ? `In ${(step.distance/1000).toFixed(1)} km` : `In ${step.distance.toFixed(0)} m`)
      : (this.currentStep === this.steps.length-1 ? 'Arriving…' : '');
    // Highlight current step
    document.querySelectorAll('.nav-step').forEach((el,i) => el.classList.toggle('current',i===this.currentStep));
    const counterEl = document.getElementById('nav-step-counter');
    if (counterEl) counterEl.textContent = `${this.currentStep+1}/${this.steps.length}`;
    // Scroll step into view
    document.getElementById('nav-step-'+this.currentStep)?.scrollIntoView({behavior:'smooth',block:'nearest'});
    // Voice
    if (speak && this.voiceEnabled && this.synth && step.instruction) {
      this.synth.cancel();
      const utt = new SpeechSynthesisUtterance(step.instruction);
      utt.lang = {en:'en-GB',de:'de-DE',fr:'fr-FR'}[ATLAS.i18n.lang]||'en-GB';
      utt.rate = 0.9;
      this.synth.speak(utt);
    }
  },

  startGPSTracking() {
    if (!navigator.geolocation) return;
    if (this.watchId) navigator.geolocation.clearWatch(this.watchId);
    this.watchId = navigator.geolocation.watchPosition(pos => {
      const { latitude: lat, longitude: lng, accuracy } = pos.coords;
      if (!this.map) return;

      // Update position marker
      const posIcon = L.divIcon({
        html: `<div style="background:var(--accent);border:3px solid white;border-radius:50%;width:20px;height:20px;box-shadow:0 0 12px var(--accent);"><div style="position:absolute;inset:-${accuracy>100?8:4}px;border:2px solid var(--accent);border-radius:50%;opacity:0.3;"></div></div>`,
        iconSize:[20,20], iconAnchor:[10,10], className:''
      });
      if (!this.posMarker) {
        this.posMarker = L.marker([lat,lng], {icon:posIcon}).addTo(this.map);
      } else {
        this.posMarker.setLatLng([lat,lng]);
      }
      this.map.panTo([lat,lng], {animate:true});

      // Smart step advancement: check distance to next step waypoints
      if (this._active && this.steps.length > 0 && this.currentStep < this.steps.length-1) {
        const nextStep = this.steps[this.currentStep+1];
        if (nextStep) {
          // Get the waypoint of the next step from route coords
          const wpIdx = nextStep.way_points?.[0];
          if (wpIdx !== undefined && this.routeCoords[wpIdx]) {
            const [wpLat, wpLng] = this.routeCoords[wpIdx];
            const dist = this.haversine(lat, lng, wpLat, wpLng);
            if (dist < 30) {  // within 30m → advance step
              this.currentStep++;
              this.renderSteps();
              this.updateInstruction(true);
            }
          }
        }
      } else if (this._active && this.currentStep >= this.steps.length-1 && this._toCoords) {
        const distToEnd = this.haversine(lat, lng, this._toCoords[0], this._toCoords[1]);
        if (distToEnd < 50) this.arrived();
      }
    }, err => {
      console.warn('GPS error:', err);
    }, { enableHighAccuracy: true, maximumAge: 3000, timeout: 15000 });
  },

  arrived() {
    if (!this._active) return;
    this._active = false;
    ATLAS.ui.toast(ATLAS.i18n.t('arrived'), 'success');
    const instrEl = document.getElementById('nav-instr-text');
    if (instrEl) instrEl.textContent = '🏁 ' + ATLAS.i18n.t('arrived');
    const arrowEl = document.getElementById('nav-arrow');
    if (arrowEl) arrowEl.textContent = '🏁';
    if (this.voiceEnabled && this.synth) {
      this.synth.cancel();
      this.synth.speak(new SpeechSynthesisUtterance(ATLAS.i18n.t('arrived')));
    }
    this.stopNav();
  },

  stopNav() {
    this._active = false;
    if (this.watchId) { navigator.geolocation.clearWatch(this.watchId); this.watchId = null; }
    if (this.synth) this.synth.cancel();
    document.getElementById('nav-stop-btn')?.classList.add('hidden');
    document.getElementById('nav-recalc-btn') && (document.getElementById('nav-recalc-btn').style.display = 'none');
  }
};


/* ============================================================
   Users Page
============================================================ */
ATLAS.usersPage = {
  _users: [],
  _wsRegistered: false,

  // Deterministic color from username
  _avatarColor(name='') {
    const colors = ['#ef4444','#f97316','#eab308','#22c55e','#14b8a6','#3b82f6','#8b5cf6','#ec4899','#06b6d4','#84cc16'];
    let h = 0;
    for (let c of name) h = (h*31 + c.charCodeAt(0)) & 0xffffffff;
    return colors[Math.abs(h) % colors.length];
  },

  async render(el) {
    const users = await ATLAS.api.get('/api/users') || [];
    this._users = users;
    const isAdmin = ATLAS.state.user?.role === 'admin';
    const onlineCount = users.filter(u=>u.online).length;

    el.innerHTML = `
      <div class="page-header">
        <h1>${ATLAS.i18n.t('users')}</h1>
        <div class="actions">
          <span style="font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:6px;">
            <span class="pulse-dot"></span> ${onlineCount} online
          </span>
          ${isAdmin ? `<button class="btn btn-primary" onclick="ATLAS.usersPage.showCreate()">+ ${ATLAS.i18n.t('create')}</button>` : ''}
        </div>
      </div>

      <!-- KPI cards -->
      <div class="kpi-grid" style="margin-bottom:16px;">
        <div class="kpi-card"><div class="kpi-label">Total Users</div><div class="kpi-value">${users.length}</div><div class="kpi-icon">👥</div></div>
        <div class="kpi-card"><div class="kpi-label">Online Now</div><div class="kpi-value" style="color:var(--success);">${onlineCount}</div><div class="kpi-icon">🟢</div></div>
        <div class="kpi-card"><div class="kpi-label">Admins</div><div class="kpi-value">${users.filter(u=>u.role==='admin').length}</div><div class="kpi-icon">🛡</div></div>
        <div class="kpi-card"><div class="kpi-label">Active</div><div class="kpi-value">${users.filter(u=>u.is_active).length}</div><div class="kpi-icon">✅</div></div>
      </div>

      <!-- Filter bar -->
      <div class="card">
        <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
          <input id="user-search" class="form-input" style="flex:1;min-width:180px;" placeholder="Search users..." oninput="ATLAS.usersPage.filter()">
          <select id="user-role-filter" class="form-select" style="width:130px;" onchange="ATLAS.usersPage.filter()">
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="operator">Operator</option>
            <option value="viewer">Viewer</option>
          </select>
          <select id="user-status-filter" class="form-select" style="width:130px;" onchange="ATLAS.usersPage.filter()">
            <option value="">All Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Language</th>
                <th>Last Seen</th>
                <th>Status</th>
                ${isAdmin ? '<th>Actions</th>' : ''}
              </tr>
            </thead>
            <tbody id="users-tbody">${this._renderRows(users)}</tbody>
          </table>
        </div>
      </div>`;

    // Register WS for live online status (only once; guard with DOM check in handler)
    if (!this._wsRegistered) {
      this._wsRegistered = true;
      ATLAS.ws.on('user_online', d => {
        if (document.getElementById('users-tbody')) this._updateOnlineStatus(d.user_id, true);
      });
      ATLAS.ws.on('user_offline', d => {
        if (document.getElementById('users-tbody')) this._updateOnlineStatus(d.user_id, false);
      });
    }
  },

  _renderRows(users) {
    const isAdmin = ATLAS.state.user?.role === 'admin';
    if (!users.length) return `<tr><td colspan="${isAdmin?6:5}" style="text-align:center;padding:24px;color:var(--text-muted);">No users found</td></tr>`;
    return users.map(u => {
      const color = this._avatarColor(u.username);
      const lastSeenAgo = u.last_seen ? this._timeAgoShort(u.last_seen) : '–';
      return `
        <tr id="user-row-${u.id}">
          <td>
            <div style="display:flex;align-items:center;gap:10px;">
              <div style="position:relative;flex-shrink:0;">
                <div style="width:36px;height:36px;border-radius:50%;background:${color}22;border:2px solid ${color};display:flex;align-items:center;justify-content:center;font-weight:700;color:${color};font-size:15px;">
                  ${(u.full_name||u.username)[0].toUpperCase()}
                </div>
                <span class="user-status-dot ${u.online?'online':'offline'}" id="dot-${u.id}" style="position:absolute;bottom:0;right:0;width:10px;height:10px;border-radius:50%;background:${u.online?'var(--success)':'var(--text-muted)'};border:2px solid var(--bg-card);"></span>
              </div>
              <div>
                <div style="font-weight:600;">${u.full_name||u.username}</div>
                <div style="font-size:11px;color:var(--text-muted);">@${u.username}</div>
              </div>
            </div>
          </td>
          <td>
            <span class="badge ${u.role==='admin'?'badge-danger':u.role==='operator'?'badge-info':'badge-neutral'}">
              ${u.role==='admin'?'🛡 ':u.role==='operator'?'⚙ ':'👁 '}${u.role}
            </span>
          </td>
          <td>
            <span style="font-size:13px;">${{en:'🇬🇧',de:'🇩🇪',fr:'🇫🇷'}[u.language||'en']||'🌐'} ${(u.language||'en').toUpperCase()}</span>
          </td>
          <td style="font-size:12px;color:var(--text-muted);">${lastSeenAgo}</td>
          <td>
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-size:12px;color:${u.online?'var(--success)':'var(--text-muted)'};" id="status-label-${u.id}">${u.online?'● Online':'○ Offline'}</span>
              ${!u.is_active?'<span class="badge badge-neutral" style="font-size:10px;">Inactive</span>':''}
            </div>
          </td>
          ${isAdmin ? `<td>
            <div style="display:flex;gap:4px;">
              <button class="btn btn-secondary btn-sm" onclick="ATLAS.usersPage.showEdit(${JSON.stringify(u).replace(/"/g,'&quot;')})">✏ Edit</button>
              ${u.id !== ATLAS.state.user?.id ? `<button class="btn btn-secondary btn-sm" onclick="ATLAS.usersPage.toggleActive(${u.id},${u.is_active?0:1})" title="${u.is_active?'Deactivate':'Activate'}">${u.is_active?'🔒':'🔓'}</button>` : ''}
            </div>
          </td>` : ''}
        </tr>`;
    }).join('');
  },

  _timeAgoShort(ts) {
    if (!ts) return '–';
    const diff = Date.now() - new Date(ts).getTime();
    const m = Math.floor(diff/60000);
    if (m < 1) return 'just now';
    if (m < 60) return m+'m ago';
    const h = Math.floor(m/60);
    if (h < 24) return h+'h ago';
    return Math.floor(h/24)+'d ago';
  },

  _updateOnlineStatus(userId, online) {
    const dot = document.getElementById('dot-'+userId);
    const label = document.getElementById('status-label-'+userId);
    if (dot) dot.style.background = online ? 'var(--success)' : 'var(--text-muted)';
    if (label) {
      label.style.color = online ? 'var(--success)' : 'var(--text-muted)';
      label.textContent = online ? '● Online' : '○ Offline';
    }
    // Update cached list
    const u = (this._users||[]).find(u=>u.id===userId);
    if (u) u.online = online;
  },

  filter() {
    const q = (document.getElementById('user-search')?.value||'').toLowerCase();
    const role = document.getElementById('user-role-filter')?.value||'';
    const status = document.getElementById('user-status-filter')?.value||'';
    const filtered = (this._users||[]).filter(u => {
      if (q && !JSON.stringify(u).toLowerCase().includes(q)) return false;
      if (role && u.role !== role) return false;
      if (status === 'online' && !u.online) return false;
      if (status === 'offline' && u.online) return false;
      if (status === 'inactive' && u.is_active) return false;
      return true;
    });
    const tbody = document.getElementById('users-tbody');
    if (tbody) tbody.innerHTML = this._renderRows(filtered);
  },

  showCreate() {
    ATLAS.ui.modal('Create User', `
      <div class="form-row">
        <div class="form-group"><label class="form-label">Username</label><input id="cu-user" class="form-input" placeholder="johndoe"></div>
        <div class="form-group"><label class="form-label">Full Name</label><input id="cu-name" class="form-input" placeholder="John Doe"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Password</label><input id="cu-pass" class="form-input" type="password"></div>
        <div class="form-group"><label class="form-label">Role</label>
          <select id="cu-role" class="form-select"><option value="viewer">Viewer</option><option value="operator">Operator</option><option value="admin">Admin</option></select>
        </div>
      </div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.usersPage.create()">+ Create</button>`
    );
  },

  async create() {
    const username = document.getElementById('cu-user').value.trim();
    const password = document.getElementById('cu-pass').value;
    if (!username || !password) { ATLAS.ui.toast('Username and password required','warning'); return; }
    try {
      await ATLAS.api.post('/api/users', { username, full_name: document.getElementById('cu-name').value, password, role: document.getElementById('cu-role').value });
      ATLAS.ui.closeModal(); ATLAS.ui.toast('User created','success'); ATLAS.router.go('users',true);
    } catch(e) { ATLAS.ui.toast(e.message,'warning'); }
  },

  showEdit(u) {
    ATLAS.ui.modal(`Edit: ${u.username}`, `
      <div class="form-row">
        <div class="form-group"><label class="form-label">Full Name</label><input id="eu-name" class="form-input" value="${u.full_name||''}"></div>
        <div class="form-group"><label class="form-label">Role</label>
          <select id="eu-role" class="form-select"><option value="viewer" ${u.role==='viewer'?'selected':''}>Viewer</option><option value="operator" ${u.role==='operator'?'selected':''}>Operator</option><option value="abteilleitung" ${u.role==='abteilleitung'?'selected':''}>Abteilungsleitung</option><option value="dispatcher" ${u.role==='dispatcher'?'selected':''}>Dispatcher</option><option value="admin" ${u.role==='admin'?'selected':''}>Admin</option></select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Email</label><input id="eu-email" class="form-input" type="email" value="${u.email||''}" placeholder="user@example.com"></div>
        <div class="form-group"><label class="form-label">Phone</label><input id="eu-phone" class="form-input" type="tel" value="${u.phone||''}" placeholder="+49 123 456789"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Status</label>
          <select id="eu-active" class="form-select"><option value="1" ${u.is_active?'selected':''}>Active</option><option value="0" ${!u.is_active?'selected':''}>Inactive</option></select>
        </div>
        <div class="form-group"><label class="form-label">New Password (leave blank to keep)</label><input id="eu-pass" class="form-input" type="password" placeholder="••••••••"></div>
      </div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${ATLAS.i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.usersPage.update(${u.id})">Save</button>`
    );
  },

  async update(id) {
    const pw = document.getElementById('eu-pass').value;
    const body = {
      full_name: document.getElementById('eu-name').value,
      role: document.getElementById('eu-role').value,
      is_active: parseInt(document.getElementById('eu-active').value),
    };
    const email = document.getElementById('eu-email')?.value?.trim();
    const phone = document.getElementById('eu-phone')?.value?.trim();
    if (email !== undefined) body.email = email;
    if (phone !== undefined) body.phone = phone;
    if (pw) body.password = pw;
    await ATLAS.api.put(`/api/users/${id}`, body);
    ATLAS.ui.closeModal();
    ATLAS.ui.toast('User updated', 'success');
    ATLAS.router.go('users', true);
  },

  async toggleActive(id, newActive) {
    await ATLAS.api.put(`/api/users/${id}`, { is_active: newActive });
    ATLAS.ui.toast(newActive ? 'User activated' : 'User deactivated', 'success');
    ATLAS.router.go('users', true);
  }
};

/* ============================================================
   Modules Page
============================================================ */
ATLAS.modulesPage = {
  _meta: {
    command_control:  { icon: '🗺', desc: 'Live map, asset tracking, incident command', nav: 'map' },
    alert_system:     { icon: '🚨', desc: 'Alert center, severity escalations, notifications', nav: 'alerts' },
    intelligence:     { icon: '📊', desc: 'KPI dashboard, real-time charts, delta indicators', nav: 'dashboard' },
    communication:    { icon: '💬', desc: 'Chat rooms, direct messages, @mentions', nav: 'chat' },
    data_logging:     { icon: '📋', desc: 'Event log, audit trail, CSV/JSON exports', nav: 'logs' },
    hardware_sensors: { icon: '📡', desc: 'Sensor dashboard, IoT readings, anomaly detection', nav: 'sensors' },
    ai_analytics:     { icon: '🤖', desc: 'Z-score anomaly detection, trend prediction, heatmaps', nav: 'analytics' },
    user_management:  { icon: '👥', desc: 'User accounts, roles (admin/operator/viewer), online status', nav: 'users' },
    fleet_management: { icon: '🚗', desc: 'Vehicles, drivers, trips, maintenance, fuel logs', nav: 'fleet' },
    navigation:       { icon: '🧭', desc: 'Turn-by-turn GPS routing, voice guidance, live tracking', nav: 'navigation' },
  },

  async render(el) {
    const modules = await ATLAS.api.get('/api/modules') || [];
    const isAdmin = ATLAS.state.user?.role === 'admin';
    const enabledCount = modules.filter(m=>m.enabled).length;

    el.innerHTML = `
      <div class="page-header">
        <h1>${ATLAS.i18n.t('modules')}</h1>
        <div style="font-size:12px;color:var(--text-muted);">${enabledCount} / ${modules.length} active</div>
      </div>

      <div class="kpi-grid" style="margin-bottom:20px;">
        <div class="kpi-card"><div class="kpi-label">Total Modules</div><div class="kpi-value">${modules.length}</div><div class="kpi-icon">📦</div></div>
        <div class="kpi-card"><div class="kpi-label">Enabled</div><div class="kpi-value" style="color:var(--success);">${enabledCount}</div><div class="kpi-icon">✅</div></div>
        <div class="kpi-card"><div class="kpi-label">Disabled</div><div class="kpi-value" style="color:var(--text-muted);">${modules.length - enabledCount}</div><div class="kpi-icon">⏸</div></div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:16px;">
        ${modules.map(m => {
          const meta = this._meta[m.name] || { icon: '⚙', desc: 'Operations module', nav: null };
          return `
          <div class="card" style="display:flex;flex-direction:column;gap:12px;${!m.enabled?'opacity:0.7;':''}" id="mod-card-${m.name}">
            <div style="display:flex;align-items:flex-start;gap:12px;">
              <div style="font-size:32px;line-height:1;flex-shrink:0;padding-top:2px;">${meta.icon}</div>
              <div style="flex:1;min-width:0;">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                  <div style="font-size:14px;font-weight:700;">${m.name.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}</div>
                  <span class="badge ${m.enabled?'badge-success':'badge-neutral'}" style="font-size:10px;">${m.enabled?'ON':'OFF'}</span>
                </div>
                <div style="font-size:12px;color:var(--text-muted);line-height:1.5;">${meta.desc}</div>
              </div>
            </div>

            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
              ${isAdmin ? `
              <button class="btn ${m.enabled?'btn-danger':'btn-primary'} btn-sm" onclick="ATLAS.modulesPage.toggle('${m.name}')">
                ${m.enabled?'⏸ Disable':'▶ Enable'}
              </button>` : ''}
              ${m.enabled && meta.nav ? `
              <button class="btn btn-secondary btn-sm" onclick="ATLAS.router.go('${meta.nav}')">
                → Open
              </button>` : ''}
            </div>
          </div>`;
        }).join('')}
      </div>`;
  },

  async toggle(name) {
    const card = document.getElementById('mod-card-'+name);
    if (card) card.style.opacity = '0.5';
    try {
      await ATLAS.api.post(`/api/modules/${name}/toggle`);
      const mods = await ATLAS.api.get('/api/modules');
      ATLAS.state.modules = mods || [];
      ATLAS.ui.buildNav();
      ATLAS.ui.toast(`Module "${name.replace(/_/g,' ')}" toggled`, 'info');
      ATLAS.router.go('modules', true);
    } catch(e) {
      ATLAS.ui.toast('Failed to toggle module', 'warning');
      if (card) card.style.opacity = '';
    }
  }
};

ATLAS.modules = {
  onToggle(data) {
    const m = ATLAS.state.modules.find(m => m.name === data.name);
    if (m) m.enabled = data.enabled;
    ATLAS.ui.buildNav();
  }
};

/* ============================================================
   Settings Page
============================================================ */
ATLAS.settingsPage = {
  async render(el) {
    // Wait for SW to finish registering (it auto-runs on load)
    await new Promise(r => setTimeout(r, 300));
    const [config, pushStatus] = await Promise.all([
      ATLAS.api.get('/api/config').catch(()=>({})),
      Promise.resolve(typeof AtlasSW !== 'undefined' ? AtlasSW.getPushStatus() : 'unsupported')
    ]);
    const isAdmin = ATLAS.state.user?.role === 'admin';
    const u = ATLAS.state.user || {};
    el.innerHTML = `
      <div class="page-header"><h1>${ATLAS.i18n.t('settings')}</h1></div>
      <div class="grid-2">
        <div style="display:flex;flex-direction:column;gap:16px;">
          ${isAdmin ? `
          <div class="card">
            <div class="card-title">🏢 Organization</div>
            <div class="form-group"><label class="form-label">${ATLAS.i18n.t('org_name')}</label><input id="cfg-org" class="form-input" value="${config.org_name||''}"></div>
            <div class="form-group"><label class="form-label">${ATLAS.i18n.t('facility_type')}</label><input id="cfg-type" class="form-input" value="${config.facility_type||''}"></div>
            <button class="btn btn-primary btn-sm" onclick="ATLAS.settingsPage.saveConfig()">💾 Save Organization</button>
          </div>
          ` : `<div class="card"><div class="card-title">🏢 Organization</div><div style="font-size:14px;font-weight:600;">${config.org_name||'Atlas AdminSysOP'}</div><div style="font-size:12px;color:var(--text-muted);">${config.facility_type||''}</div></div>`}

          <div class="card">
            <div class="card-title">🎨 ${ATLAS.i18n.t('theme')}</div>
            <p style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">Choose from 11 visual themes. Your preference is saved per account.</p>
            <button class="btn btn-secondary w-full" onclick="ATLAS.ui.showThemePicker()">🎨 Open Theme Picker (11 themes)</button>
          </div>

          <div class="card">
            <div class="card-title">🌐 ${ATLAS.i18n.t('language')}</div>
            <div style="display:flex;gap:8px;">
              <button class="lang-btn ${ATLAS.i18n.lang==='en'?'active':''}" onclick="ATLAS.i18n.setLang('en');ATLAS.api.put('/api/auth/me',{language:'en'})">🇬🇧 English</button>
              <button class="lang-btn ${ATLAS.i18n.lang==='de'?'active':''}" onclick="ATLAS.i18n.setLang('de');ATLAS.api.put('/api/auth/me',{language:'de'})">🇩🇪 Deutsch</button>
              <button class="lang-btn ${ATLAS.i18n.lang==='fr'?'active':''}" onclick="ATLAS.i18n.setLang('fr');ATLAS.api.put('/api/auth/me',{language:'fr'})">🇫🇷 Français</button>
            </div>
          </div>

          <div class="card">
            <div class="card-title">🔒 Change Password</div>
            <div class="form-group"><label class="form-label">Current Password</label><input id="pw-current" class="form-input" type="password" placeholder="Current password"></div>
            <div class="form-group"><label class="form-label">New Password</label><input id="pw-new" class="form-input" type="password" placeholder="New password (min 8 chars)"></div>
            <div class="form-group"><label class="form-label">Confirm New Password</label><input id="pw-confirm" class="form-input" type="password" placeholder="Repeat new password"></div>
            <button class="btn btn-primary btn-sm" onclick="ATLAS.settingsPage.changePassword()">🔒 Update Password</button>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:16px;">
          <div class="card">
            <div class="card-title">🔔 Alert Tone</div>
            <div class="form-group">
              <label class="form-label">Your alert tone</label>
              <select class="form-select" id="settings-tone" onchange="ATLAS.api.put('/api/auth/me',{alert_tone:this.value});ATLAS.state.user.alert_tone=this.value">
                ${ATLAS.audio.tones.map(t=>`<option value="${t.id}" ${u.alert_tone===t.id?'selected':''}>${t.name}</option>`).join('')}
              </select>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="ATLAS.audio.test(document.getElementById('settings-tone').value)">▶ ${ATLAS.i18n.t('test_tone')}</button>
            <div class="divider"></div>
            <div style="font-size:12px;font-weight:600;color:var(--text-muted);margin-bottom:8px;">ALL 20 TONES</div>
            <div style="display:flex;flex-direction:column;gap:5px;max-height:280px;overflow-y:auto;">
              ${ATLAS.audio.tones.map(t=>`
                <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 10px;border-radius:var(--radius-sm);border:1px solid var(--border);transition:background 0.15s;" onmouseover="this.style.background='var(--nav-hover-bg)'" onmouseout="this.style.background=''">
                  <span style="font-size:12px;font-weight:${u.alert_tone===t.id?'700':'400'};color:${u.alert_tone===t.id?'var(--accent)':'var(--text-primary)'};">${t.name}</span>
                  <button class="btn btn-secondary btn-sm" style="padding:2px 8px;" onclick="ATLAS.audio.test('${t.id}')">▶</button>
                </div>`).join('')}
            </div>
          </div>

          <div class="card">
            <div class="card-title">📱 Push Notifications</div>

            <!-- Status indicator -->
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;padding:10px 12px;border-radius:var(--radius-sm);background:var(--bg-input);">
              <span style="font-size:20px;">${
                pushStatus === 'unsupported' ? '🚫' :
                pushStatus === 'denied'      ? '🔕' :
                pushStatus === 'active'      ? '🔔' : '💤'
              }</span>
              <div>
                <div style="font-size:13px;font-weight:600;margin-bottom:2px;">${
                  pushStatus === 'unsupported' ? 'Not supported' :
                  pushStatus === 'denied'      ? 'Blocked by browser' :
                  pushStatus === 'active'      ? 'Active' : 'Not enabled'
                }</div>
                <div style="font-size:11px;color:var(--text-muted);">${
                  pushStatus === 'unsupported' ? 'Your browser does not support Web Push.' :
                  pushStatus === 'denied'      ? 'Allow notifications in browser settings, then reload.' :
                  pushStatus === 'active'      ? 'You will receive push alerts even when the tab is in background.' :
                  'Enable to receive alerts even when the tab is closed or in background.'
                }</div>
              </div>
            </div>

            <!-- Silent-mode bypass info -->
            <div style="font-size:11px;color:var(--text-muted);margin-bottom:12px;padding:8px 10px;border-radius:var(--radius-sm);border:1px solid var(--border);">
              🔊 <b>Silent Mode Bypass:</b> Critical alerts use <code>silent: false</code> + vibration patterns to bypass DND/quiet modes on Android. On iOS, install as PWA (Add to Home Screen) for best results.
            </div>

            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              ${pushStatus === 'not_subscribed' ? `
              <button class="btn btn-primary btn-sm" onclick="ATLAS.settingsPage.enablePush()">
                🔔 Enable Push Notifications
              </button>` : ''}
              ${pushStatus === 'denied' ? `
              <button class="btn btn-secondary btn-sm" disabled title="Allow notifications in your browser settings first">
                🔕 Blocked – Change in Browser Settings
              </button>` : ''}
              ${pushStatus === 'active' ? `
              <button class="btn btn-primary btn-sm" onclick="ATLAS.settingsPage.testPush()">
                🧪 Send Test Notification
              </button>
              <button class="btn btn-secondary btn-sm" onclick="ATLAS.settingsPage.disablePush()">
                🔕 Disable
              </button>` : ''}
              ${pushStatus === 'unsupported' ? '' : `
              <button class="btn btn-secondary btn-sm" onclick="ATLAS.settingsPage.testLocalPush()">
                📳 Test Local Notification
              </button>`}
            </div>
          </div>

          ${isAdmin ? `
          <div class="card">
            <div class="card-title">🔧 System Administration</div>
            <div style="display:flex;flex-direction:column;gap:10px;">
              <div>
                <div style="font-size:12px;font-weight:600;color:var(--text-muted);margin-bottom:6px;">DATABASE BACKUP</div>
                <p style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Download a complete backup of the SQLite database.</p>
                <button class="btn btn-primary btn-sm" onclick="ATLAS.settingsPage.downloadBackup()">💾 ${ATLAS.i18n.t('backup')}</button>
              </div>
              <div class="divider" style="margin:4px 0;"></div>
              <div>
                <div style="font-size:12px;font-weight:600;color:var(--text-muted);margin-bottom:6px;">SERVER RESTART</div>
                <p style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Restarts the backend process. The page will reload automatically after ~3 seconds.</p>
                <button class="btn btn-danger btn-sm" onclick="ATLAS.settingsPage.restartServer()">🔄 ${ATLAS.i18n.t('server_restart')}</button>
              </div>
              <div class="divider" style="margin:4px 0;"></div>
              <div>
                <div style="font-size:12px;font-weight:600;color:var(--text-muted);margin-bottom:6px;">PI SENSORS</div>
                <div id="pi-sensors-display">
                  <button class="btn btn-secondary btn-sm" onclick="ATLAS.settingsPage.loadPiSensors()">📡 ${ATLAS.i18n.t('pi_sensors')} (${ATLAS.i18n.t('refresh')})</button>
                </div>
              </div>
            </div>
          </div>` : ''}

          <div class="card">
            <div class="card-title">ℹ️ About Atlas AdminSysOP</div>
            <div style="font-size:13px;display:flex;flex-direction:column;gap:8px;">
              ${[
                ['Application', 'Atlas AdminSysOP'],
                ['Version', '2.0.0'],
                ['Build', new Date().getFullYear()],
                ['Copyright', '© Felix Greis | Atlas GmbH 2026'],
                ['Backend', 'Python FastAPI + SQLite + WebSocket'],
                ['Frontend', 'Vanilla JS + Leaflet + Chart.js'],
                ['Themes', '11 built-in visual themes'],
                ['Languages', 'English, Deutsch, Français'],
              ].map(([k,v])=>`
                <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--border);">
                  <span style="color:var(--text-muted);font-size:12px;">${k}</span>
                  <span style="font-weight:500;font-size:12px;">${v}</span>
                </div>`).join('')}
            </div>
            <div style="margin-top:12px;padding:10px;background:var(--accent-dim);border-radius:var(--radius-sm);font-size:11px;color:var(--text-muted);text-align:center;">
              Atlas AdminSysOP – Professional Operations Management Platform<br>© Felix Greis | Atlas GmbH 2026 – All rights reserved.
            </div>
          </div>
        </div>
      </div>`;
  },

  async saveConfig() {
    const org = document.getElementById('cfg-org').value.trim();
    const type = document.getElementById('cfg-type').value.trim();
    if (!org) { ATLAS.ui.toast('Organization name required','warning'); return; }
    await ATLAS.api.put('/api/config', { org_name: org, facility_type: type });
    document.getElementById('sidebar-org-name').textContent = org;
    ATLAS.ui.toast('Organization settings saved','success');
  },

  async changePassword() {
    const current = document.getElementById('pw-current').value;
    const newPw = document.getElementById('pw-new').value;
    const confirm = document.getElementById('pw-confirm').value;
    if (!current || !newPw || !confirm) { ATLAS.ui.toast('All fields required','warning'); return; }
    if (newPw !== confirm) { ATLAS.ui.toast('Passwords do not match','warning'); return; }
    if (newPw.length < 8) { ATLAS.ui.toast('Password must be at least 8 characters','warning'); return; }
    try {
      await ATLAS.api.put('/api/auth/me', { current_password: current, password: newPw });
      ATLAS.ui.toast('Password changed successfully','success');
      document.getElementById('pw-current').value = '';
      document.getElementById('pw-new').value = '';
      document.getElementById('pw-confirm').value = '';
    } catch(e) { ATLAS.ui.toast(e.message||'Failed to change password','warning'); }
  },

  async enablePush() {
    // Guard: Push requires HTTPS (or localhost)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      ATLAS.ui.modal('HTTPS erforderlich', `
        <p style="margin-bottom:12px;">Web Push Notifications erfordern eine <strong>sichere HTTPS-Verbindung</strong>.</p>
        <p style="font-size:13px;color:var(--text-muted);">Aktuell: <code>${location.protocol}//${location.hostname}</code></p>
        <p style="font-size:13px;color:var(--text-muted);margin-top:8px;">Bitte entweder:</p>
        <ul style="font-size:13px;color:var(--text-muted);padding-left:20px;line-height:2;">
          <li>Über <code>localhost:8080</code> öffnen (lokaler Betrieb)</li>
          <li>Tailscale / Reverse-Proxy mit HTTPS-Zertifikat verwenden</li>
          <li>Ngrok / Cloudflare Tunnel für HTTPS-Tunnel nutzen</li>
        </ul>`,
        `<button class="btn btn-primary" onclick="ATLAS.ui.closeModal()">OK</button>`
      );
      return;
    }
    if (typeof AtlasSW === 'undefined' || !AtlasSW.supported) {
      ATLAS.ui.toast('Dieser Browser unterstützt keine Push-Benachrichtigungen.', 'warning');
      return;
    }
    // Ensure SW is registered before subscribing
    if (!AtlasSW.registration) {
      ATLAS.ui.toast('Service Worker wird initialisiert…', 'info');
      const ok = await AtlasSW.register();
      if (!ok || !AtlasSW.registration) {
        ATLAS.ui.toast('Service Worker Registrierung fehlgeschlagen. Seite neu laden.', 'warning');
        return;
      }
      await new Promise(r => setTimeout(r, 300)); // give SW time to activate
    }
    ATLAS.ui.toast('Berechtigungsanfrage wird gestellt…', 'info');
    const sub = await AtlasSW.subscribePush(ATLAS.state.token);
    if (sub) {
      ATLAS.ui.toast('✅ Push-Benachrichtigungen aktiviert!', 'success');
      ATLAS.router.go('settings', true);
    } else {
      const perm = Notification.permission;
      if (perm === 'denied') {
        ATLAS.ui.modal('Benachrichtigungen entsperren', `
          <p style="margin-bottom:12px;">Die Berechtigung wurde <strong>verweigert</strong>. So entsperren:</p>
          <ul style="margin:0;padding-left:20px;font-size:13px;color:var(--text-muted);line-height:2.2;">
            <li><strong>Chrome/Edge:</strong> Adressleiste → 🔒 → Benachrichtigungen → Erlauben → Seite neu laden</li>
            <li><strong>Firefox:</strong> Adressleiste → 🔒 → Berechtigungen → Benachrichtigungen löschen → neu versuchen</li>
            <li><strong>Safari (macOS):</strong> Safari → Einstellungen → Websites → Benachrichtigungen → Atlas erlauben</li>
            <li><strong>iOS Safari:</strong> Einstellungen → Apps → Safari → Atlas → Benachrichtigungen → Erlauben</li>
            <li><strong>Samsung Internet:</strong> ≡ Menü → Einstellungen → Websites → Benachrichtigungen</li>
          </ul>
          <p style="margin-top:12px;font-size:11px;color:var(--text-dim);">Tipp: Als PWA installieren (Teilen → Zum Home-Bildschirm) für beste Ergebnisse auf iOS.</p>`,
          `<button class="btn btn-primary" onclick="ATLAS.ui.closeModal()">Verstanden</button>`
        );
      } else {
        ATLAS.ui.toast('Push konnte nicht aktiviert werden – Konsole für Details öffnen (F12).', 'warning');
      }
    }
  },

  async disablePush() {
    if (typeof AtlasSW === 'undefined') return;
    await AtlasSW.unsubscribePush(ATLAS.state.token);
    ATLAS.ui.toast('Push-Benachrichtigungen deaktiviert', 'info');
    ATLAS.router.go('settings', true);
  },

  async testPush() {
    if (typeof AtlasSW === 'undefined') return;
    ATLAS.ui.toast('Test-Push wird gesendet…', 'info');
    const ok = await AtlasSW.sendTestPush(ATLAS.state.token);
    if (ok) {
      ATLAS.ui.toast('✅ Test-Push gesendet! Benachrichtigungsleiste prüfen.', 'success');
    } else {
      // Fallback: local notification via SW (no server needed)
      await this.testLocalPush();
    }
  },

  async testLocalPush() {
    if (typeof AtlasSW === 'undefined') {
      ATLAS.ui.toast('Service Worker nicht verfügbar', 'warning'); return;
    }
    const ok = await AtlasSW.showLocalNotification(
      '🔔 Atlas Test-Benachrichtigung',
      'Push-Benachrichtigungen funktionieren korrekt!',
      {
        tag: 'atlas-test',
        requireInteraction: false,
        vibrate: [100, 50, 100],
        data: { url: '/#/settings' },
        actions: [{ action: 'view', title: 'Einstellungen öffnen' }],
      }
    );
    if (ok) {
      ATLAS.ui.toast('✅ Lokale Test-Benachrichtigung gesendet!', 'success');
    } else {
      ATLAS.ui.toast('Bitte zuerst Benachrichtigungen erlauben.', 'warning');
    }
  },

  downloadBackup() {
    const a = document.createElement('a');
    a.href = '/api/system/backup';
    a.download = `atlas_backup_${new Date().toISOString().slice(0,10)}.db`;
    // Auth header can't be set on anchor tag – pass token in cookie or use window.open
    // Instead: fetch with auth then create object URL
    fetch('/api/system/backup', { headers: { 'Authorization': `Bearer ${ATLAS.state.token}` } })
      .then(r => r.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a2 = document.createElement('a');
        a2.href = url; a2.download = `atlas_backup_${new Date().toISOString().slice(0,10)}.db`;
        a2.click(); URL.revokeObjectURL(url);
        ATLAS.ui.toast('Backup downloaded', 'success');
      }).catch(e => ATLAS.ui.toast('Backup failed: ' + e.message, 'error'));
  },

  async restartServer() {
    if (!confirm('Restart the Atlas server? The page will reload automatically.')) return;
    try {
      await ATLAS.api.post('/api/system/restart', {});
      ATLAS.ui.toast('Server restarting...', 'info');
      setTimeout(() => location.reload(), 4000);
    } catch(e) { ATLAS.ui.toast('Restart failed: ' + e.message, 'error'); }
  },

  async loadPiSensors() {
    const el = document.getElementById('pi-sensors-display');
    if (el) el.innerHTML = '⏳ Loading...';
    try {
      const data = await ATLAS.api.get('/api/system/sensors');
      if (el) {
        const temp = data.cpu_temp_c != null ? `${data.cpu_temp_c}°C` : 'N/A';
        const volt = data.cpu_voltage_v != null ? `${data.cpu_voltage_v}V` : 'N/A';
        const platform = data.platform || 'unknown';
        el.innerHTML = `
          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            <div style="padding:8px 14px;background:var(--bg-input);border-radius:var(--radius-sm);text-align:center;">
              <div style="font-size:10px;color:var(--text-muted);">🌡️ ${ATLAS.i18n.t('cpu_temp')}</div>
              <div style="font-size:18px;font-weight:700;">${temp}</div>
            </div>
            <div style="padding:8px 14px;background:var(--bg-input);border-radius:var(--radius-sm);text-align:center;">
              <div style="font-size:10px;color:var(--text-muted);">⚡ ${ATLAS.i18n.t('cpu_voltage')}</div>
              <div style="font-size:18px;font-weight:700;">${volt}</div>
            </div>
            <div style="padding:8px 14px;background:var(--bg-input);border-radius:var(--radius-sm);text-align:center;">
              <div style="font-size:10px;color:var(--text-muted);">Platform</div>
              <div style="font-size:13px;font-weight:600;">${platform}</div>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" style="margin-top:8px;" onclick="ATLAS.settingsPage.loadPiSensors()">🔄 ${ATLAS.i18n.t('refresh')}</button>`;
      }
    } catch(e) {
      if (el) el.innerHTML = `<span style="color:var(--danger);">Failed: ${e.message}</span>`;
    }
  },
};

/* ============================================================
   Pager Gateway Page
============================================================ */
ATLAS.pagerPage = {
  _tab: 'rx',
  _rxMessages: [],
  _rxRunning: false,
  _config: null,

  async render(el) {
    const t = k => ATLAS.i18n.t(k);
    el.innerHTML = `
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
        <h2 style="margin:0;">📟 ${t('pager')}</h2>
      </div>
      <div class="tab-bar" style="display:flex;gap:4px;margin-bottom:20px;background:var(--bg-card);padding:4px;border-radius:var(--radius-sm);border:1px solid var(--border-color);">
        <button class="btn btn-sm pager-tab-btn ${this._tab==='rx'?'btn-primary':''}" data-tab="rx" onclick="ATLAS.pagerPage.switchTab('rx')">📡 ${t('pager_rx')}</button>
        <button class="btn btn-sm pager-tab-btn ${this._tab==='tx'?'btn-primary':''}" data-tab="tx" onclick="ATLAS.pagerPage.switchTab('tx')">📤 ${t('pager_tx')}</button>
        <button class="btn btn-sm pager-tab-btn ${this._tab==='channels'?'btn-primary':''}" data-tab="channels" onclick="ATLAS.pagerPage.switchTab('channels')">🔔 ${t('pager_channels')}</button>
      </div>
      <div id="pager-tab-content"></div>`;
    await this.loadConfig();
    this.renderTab();
  },

  async loadConfig() {
    try {
      const cfg = await ATLAS.api.get('/api/pager/config');
      if (cfg) this._config = cfg;
    } catch(e) { this._config = {}; }
  },

  switchTab(tab) {
    this._tab = tab;
    document.querySelectorAll('.pager-tab-btn').forEach(b => {
      b.classList.toggle('btn-primary', b.dataset.tab === tab);
      b.classList.remove('btn-secondary');
      if (b.dataset.tab !== tab) b.classList.add('btn-secondary');
    });
    this.renderTab();
  },

  async renderTab() {
    const el = document.getElementById('pager-tab-content');
    if (!el) return;
    if (this._tab === 'rx') await this.renderRX(el);
    else if (this._tab === 'tx') await this.renderTX(el);
    else await this.renderChannels(el);
  },

  async renderRX(el) {
    const t = k => ATLAS.i18n.t(k);
    const cfg = this._config || {};
    // Get RX status
    let status = { running: false, last_received: null, message_count: 0 };
    try { status = await ATLAS.api.get('/api/pager/rx/status') || status; } catch(e) {}
    this._rxRunning = status.running;

    // Get recent messages
    let msgs = [];
    try { const r = await ATLAS.api.get('/api/pager/rx/messages?limit=50'); msgs = r?.messages || []; } catch(e) {}
    this._rxMessages = msgs;

    el.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
        <div class="card" style="padding:16px;">
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">${t('status')}</div>
          <div id="rx-status-badge" class="badge ${this._rxRunning?'badge-success':'badge-muted'}" style="font-size:14px;padding:6px 12px;">
            ${this._rxRunning ? '🟢 '+t('rx_running') : '🔴 '+t('rx_stopped')}
          </div>
        </div>
        <div class="card" style="padding:16px;">
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">${t('rx_frequency')}</div>
          <div style="font-weight:600;">${cfg.rx_frequency || 439.9875} MHz</div>
          <div style="font-size:11px;color:var(--text-muted);">Gain: ${cfg.rx_gain || 40} dB | Msg: ${status.message_count || 0}</div>
        </div>
      </div>

      <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
        <button id="rx-start-btn" class="btn btn-primary" onclick="ATLAS.pagerPage.startRX()" ${this._rxRunning?'disabled':''}>
          ▶ ${t('start_rx')}
        </button>
        <button id="rx-stop-btn" class="btn btn-danger" onclick="ATLAS.pagerPage.stopRX()" ${!this._rxRunning?'disabled':''}>
          ⏹ ${t('stop_rx')}
        </button>
        <div style="flex:1"></div>
        <button class="btn btn-secondary btn-sm" onclick="ATLAS.pagerPage.renderTab()">🔄 ${t('refresh')}</button>
      </div>

      <div class="card">
        <div style="padding:12px 16px;border-bottom:1px solid var(--border-color);display:flex;justify-content:space-between;align-items:center;">
          <div style="font-weight:600;">${t('pager_rx')} – Live Feed</div>
          <div style="font-size:11px;color:var(--text-muted);">${msgs.length} ${t('history')}</div>
        </div>
        <div id="pager-rx-feed" style="max-height:400px;overflow-y:auto;">
          ${msgs.length === 0
            ? `<div style="padding:32px;text-align:center;color:var(--text-muted);">${t('no_data')}</div>`
            : msgs.map(m => this._rxMsgHtml(m)).join('')}
        </div>
      </div>

      <div class="card" style="margin-top:16px;padding:16px;">
        <div style="font-weight:600;margin-bottom:12px;">⚙ ${t('rx_frequency')} & ${t('rx_filter_capcodes')}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr auto;gap:12px;align-items:end;">
          <div>
            <label class="form-label">${t('rx_frequency')}</label>
            <input type="number" id="rx-freq" class="form-input" value="${cfg.rx_frequency||439.9875}" step="0.0001">
          </div>
          <div>
            <label class="form-label">${t('rx_gain')}</label>
            <input type="number" id="rx-gain" class="form-input" value="${cfg.rx_gain||40}" min="0" max="50">
          </div>
          <div>
            <label class="form-label" style="visibility:hidden;">save</label>
            <button class="btn btn-primary" onclick="ATLAS.pagerPage.saveRXConfig()">${t('save')}</button>
          </div>
        </div>
        <div style="margin-top:10px;">
          <label class="form-label">${t('rx_filter_capcodes')}</label>
          <input type="text" id="rx-capcodes" class="form-input" value="${(cfg.rx_filter_capcodes||'[]').replace(/["\[\]]/g,'').replace(/,/g,', ')}" placeholder="e.g. 1234567, 8901234">
        </div>
        <div style="margin-top:10px;display:flex;align-items:center;gap:8px;">
          <input type="checkbox" id="rx-create-alerts" ${cfg.rx_create_alerts?'checked':''}>
          <label for="rx-create-alerts">${t('rx_create_alerts')}</label>
        </div>
      </div>`;
  },

  _rxMsgHtml(m) {
    const ts = new Date(m.received_at).toLocaleString();
    return `<div class="pager-rx-msg" style="padding:10px 16px;border-bottom:1px solid var(--border-color);display:flex;gap:12px;align-items:flex-start;">
      <div style="flex-shrink:0;">
        <span class="capcode-badge">${m.capcode||'—'}</span>
        <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">${m.protocol||''}</div>
      </div>
      <div style="flex:1;min-width:0;">
        <div style="word-break:break-word;">${m.message}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${ts} · ${m.frequency||''}MHz</div>
      </div>
      ${m.alert_id ? `<div style="font-size:11px;color:var(--accent);">🔔 #${m.alert_id}</div>` : ''}
    </div>`;
  },

  onRxMessage(data) {
    const feed = document.getElementById('pager-rx-feed');
    if (!feed) return;
    const noData = feed.querySelector('div[style*="text-align:center"]');
    if (noData) feed.innerHTML = '';
    feed.insertAdjacentHTML('afterbegin', this._rxMsgHtml(data));
    // Update count
    const badge = document.getElementById('rx-status-badge');
    if (badge) badge.className = `badge badge-success`;
  },

  async startRX() {
    const ok = await ATLAS.api.post('/api/pager/rx/start', {});
    if (ok) {
      ATLAS.ui.toast(ATLAS.i18n.t('rx_running'), 'success');
      this._rxRunning = true;
      const btn = document.getElementById('rx-start-btn');
      const stop = document.getElementById('rx-stop-btn');
      if (btn) btn.disabled = true;
      if (stop) stop.disabled = false;
      document.getElementById('rx-status-badge').innerHTML = '🟢 ' + ATLAS.i18n.t('rx_running');
      document.getElementById('rx-status-badge').className = 'badge badge-success';
    }
  },

  async stopRX() {
    const ok = await ATLAS.api.post('/api/pager/rx/stop', {});
    if (ok) {
      ATLAS.ui.toast(ATLAS.i18n.t('rx_stopped'), 'info');
      this._rxRunning = false;
      const btn = document.getElementById('rx-start-btn');
      const stop = document.getElementById('rx-stop-btn');
      if (btn) btn.disabled = false;
      if (stop) stop.disabled = true;
      document.getElementById('rx-status-badge').innerHTML = '🔴 ' + ATLAS.i18n.t('rx_stopped');
      document.getElementById('rx-status-badge').className = 'badge badge-muted';
    }
  },

  async saveRXConfig() {
    const freq = parseFloat(document.getElementById('rx-freq').value);
    const gain = parseInt(document.getElementById('rx-gain').value);
    const capcodes = document.getElementById('rx-capcodes').value
      .split(',').map(s=>s.trim()).filter(Boolean);
    const create_alerts = document.getElementById('rx-create-alerts').checked ? 1 : 0;
    const ok = await ATLAS.api.put('/api/pager/config', {
      rx_frequency: freq, rx_gain: gain,
      rx_filter_capcodes: JSON.stringify(capcodes),
      rx_create_alerts: create_alerts
    });
    if (ok) ATLAS.ui.toast(ATLAS.i18n.t('success'), 'success');
  },

  async renderTX(el) {
    const t = k => ATLAS.i18n.t(k);
    const cfg = this._config || {};
    const callsigns = (cfg.dapnet_target_callsigns||'[]').replace(/["\[\]]/g,'').replace(/,/g,', ');
    el.innerHTML = `
      <div class="card" style="padding:16px;margin-bottom:16px;">
        <div style="font-weight:600;margin-bottom:14px;">📤 ${t('send_to_pager')}</div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div>
            <label class="form-label">${t('message')}</label>
            <textarea id="tx-message" class="form-input" rows="3" maxlength="80" placeholder="Max. 80 Zeichen (POCSAG Alpha)"></textarea>
            <div style="font-size:11px;color:var(--text-muted);margin-top:4px;" id="tx-char-count">0 / 80</div>
          </div>
          <div>
            <label class="form-label">${t('target_callsigns')}</label>
            <input type="text" id="tx-callsigns" class="form-input" value="${callsigns}" placeholder="e.g. DL1XY, DL2AB">
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">Separate multiple callsigns with commas</div>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-primary" onclick="ATLAS.pagerPage.sendTX()">📡 ${t('send_to_pager')}</button>
            <button class="btn btn-secondary" onclick="ATLAS.pagerPage.testDAPNET()">🔧 ${t('pager_test_ok')} DAPNET</button>
          </div>
        </div>
      </div>

      <div class="card" style="padding:16px;">
        <div style="font-weight:600;margin-bottom:14px;">⚙ ${t('dapnet_config')}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div>
            <label class="form-label">${t('callsign')}</label>
            <input type="text" id="dapnet-callsign" class="form-input" value="${cfg.dapnet_callsign||''}" placeholder="DL1XY">
          </div>
          <div>
            <label class="form-label">${t('transmitter_group')}</label>
            <input type="text" id="dapnet-txgrp" class="form-input" value="${cfg.dapnet_transmitter_group||'dl-all'}">
          </div>
          <div>
            <label class="form-label">${t('password')}</label>
            <input type="password" id="dapnet-pass" class="form-input" value="${cfg.dapnet_password||''}" placeholder="DAPNET password">
          </div>
          <div>
            <label class="form-label">${t('severity')} trigger</label>
            <input type="text" id="dapnet-severity" class="form-input" value="${cfg.dapnet_on_severity||'critical,warning'}" placeholder="critical,warning">
          </div>
        </div>
        <div style="margin-top:10px;display:flex;align-items:center;gap:8px;">
          <input type="checkbox" id="dapnet-enabled" ${cfg.dapnet_enabled?'checked':''}>
          <label for="dapnet-enabled">${t('enabled')}: DAPNET auto-dispatch on alerts</label>
        </div>
        <button class="btn btn-primary" style="margin-top:12px;" onclick="ATLAS.pagerPage.saveDAPNETConfig()">${t('save')}</button>
      </div>`;

    // Char counter
    const ta = document.getElementById('tx-message');
    if (ta) ta.oninput = () => {
      document.getElementById('tx-char-count').textContent = ta.value.length + ' / 80';
    };
  },

  async sendTX() {
    const msg = document.getElementById('tx-message')?.value?.trim();
    const callsigns = document.getElementById('tx-callsigns')?.value?.split(',').map(s=>s.trim()).filter(Boolean);
    if (!msg) return ATLAS.ui.toast(ATLAS.i18n.t('error') + ': no message', 'error');
    if (!callsigns?.length) return ATLAS.ui.toast(ATLAS.i18n.t('error') + ': no callsigns', 'error');
    const res = await ATLAS.api.post('/api/pager/tx', { message: msg, callsigns });
    if (res?.ok) ATLAS.ui.toast('📡 ' + ATLAS.i18n.t('send_to_pager') + ' OK', 'success');
    else ATLAS.ui.toast(ATLAS.i18n.t('pager_test_fail'), 'error');
  },

  async testDAPNET() {
    ATLAS.ui.toast('Testing DAPNET…', 'info');
    const res = await ATLAS.api.post('/api/pager/tx/test', {});
    if (res?.ok) ATLAS.ui.toast('✅ ' + ATLAS.i18n.t('pager_test_ok'), 'success');
    else ATLAS.ui.toast('❌ ' + ATLAS.i18n.t('pager_test_fail'), 'error');
  },

  async saveDAPNETConfig() {
    const callsign = document.getElementById('dapnet-callsign').value.trim().toUpperCase();
    const password = document.getElementById('dapnet-pass').value;
    const transmitter_group = document.getElementById('dapnet-txgrp').value.trim();
    const dapnet_on_severity = document.getElementById('dapnet-severity').value.trim();
    const dapnet_enabled = document.getElementById('dapnet-enabled').checked ? 1 : 0;
    const ok = await ATLAS.api.put('/api/pager/config', {
      dapnet_callsign: callsign, dapnet_password: password,
      dapnet_transmitter_group: transmitter_group,
      dapnet_on_severity, dapnet_enabled
    });
    if (ok) { ATLAS.ui.toast(ATLAS.i18n.t('success'), 'success'); await this.loadConfig(); }
  },

  async renderChannels(el) {
    const t = k => ATLAS.i18n.t(k);
    const cfg = this._config || {};
    let wpStatus = 'unknown';
    if (typeof AtlasSW !== 'undefined') wpStatus = AtlasSW.getPushStatus();
    const channels = JSON.parse(cfg.channels || '["webpush"]');

    el.innerHTML = `
      <!-- Web Push -->
      <div class="card" style="padding:16px;margin-bottom:16px;">
        <div style="font-weight:600;margin-bottom:10px;">🌐 ${t('webpush_status')}</div>
        <div style="display:flex;align-items:center;gap:12px;">
          <span class="badge ${wpStatus==='active'?'badge-success':'badge-muted'}">${wpStatus}</span>
          ${wpStatus !== 'active' ? `<button class="btn btn-primary btn-sm" onclick="ATLAS.settingsPage.enablePush()">Enable Web Push</button>` : `<button class="btn btn-secondary btn-sm" onclick="ATLAS.settingsPage.testPush()">Test Push</button>`}
        </div>
      </div>

      <!-- ntfy -->
      <div class="card" style="padding:16px;margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <div style="font-weight:600;">📱 ${t('ntfy_config')}</div>
          <div style="display:flex;align-items:center;gap:8px;">
            <input type="checkbox" id="ntfy-enabled" ${cfg.ntfy_enabled?'checked':''}>
            <label for="ntfy-enabled">${t('enabled')}</label>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:2fr 1fr;gap:12px;margin-bottom:12px;">
          <div>
            <label class="form-label">${t('ntfy_url')}</label>
            <input type="url" id="ntfy-url" class="form-input" value="${cfg.ntfy_url||''}" placeholder="http://localhost:2586">
          </div>
          <div>
            <label class="form-label">${t('ntfy_topic')}</label>
            <input type="text" id="ntfy-topic" class="form-input" value="${cfg.ntfy_topic||'atlas-alerts'}">
          </div>
        </div>
        <div style="margin-bottom:12px;">
          <label class="form-label">${t('ntfy_token')} (optional)</label>
          <input type="password" id="ntfy-token" class="form-input" value="${cfg.ntfy_token||''}" placeholder="Bearer token if server requires auth">
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-primary btn-sm" onclick="ATLAS.pagerPage.saveNtfyConfig()">${t('save')}</button>
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.pagerPage.testNtfy()">🔔 Test ntfy</button>
        </div>
        <div style="margin-top:10px;font-size:11px;color:var(--text-muted);">
          iOS: Install <strong>ntfy</strong> from App Store, subscribe to this topic.<br>
          For iOS push via APNs, set <code>upstream-base-url: https://ntfy.sh</code> in your ntfy server config.
        </div>
      </div>

      <!-- Apprise -->
      <div class="card" style="padding:16px;margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <div style="font-weight:600;">🔗 ${t('apprise_config')}</div>
          <div style="display:flex;align-items:center;gap:8px;">
            <input type="checkbox" id="apprise-enabled" ${cfg.apprise_enabled?'checked':''}>
            <label for="apprise-enabled">${t('enabled')}</label>
          </div>
        </div>
        <div style="margin-bottom:12px;">
          <label class="form-label">${t('apprise_urls')}</label>
          <textarea id="apprise-urls" class="form-input" rows="5" placeholder="tgram://bottoken/chatid&#10;mailto://user:pass@gmail.com&#10;discord://webhook_id/webhook_token&#10;slack://tokenA/tokenB/tokenC/channel">${cfg.apprise_urls||''}</textarea>
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:12px;">
          90+ services supported: Telegram, Email, Discord, Slack, Signal, Matrix, PushOver, Gotify…<br>
          See <a href="https://github.com/caronc/apprise/wiki" target="_blank" style="color:var(--accent);">apprise wiki</a> for URL formats.
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-primary btn-sm" onclick="ATLAS.pagerPage.saveAppriseConfig()">${t('save')}</button>
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.pagerPage.testApprise()">🔗 Test Apprise</button>
        </div>
      </div>

      <!-- Gotify Config -->
      <div class="card" style="padding:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <div style="font-weight:600;">🔔 ${t('gotify_config')}</div>
          <div style="display:flex;align-items:center;gap:8px;">
            <input type="checkbox" id="gotify-enabled" ${cfg.gotify_enabled?'checked':''}>
            <label for="gotify-enabled">${t('enabled')}</label>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">${t('gotify_url')}</label>
            <input id="gotify-url" class="form-input" placeholder="http://your-gotify:80" value="${cfg.gotify_url||''}">
          </div>
          <div class="form-group">
            <label class="form-label">${t('gotify_token')}</label>
            <input id="gotify-token" class="form-input" type="password" placeholder="App token" value="${cfg.gotify_token||''}">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">${t('gotify_priority')} (1-10)</label>
          <input id="gotify-priority" class="form-input" type="number" min="1" max="10" value="${cfg.gotify_priority||5}" style="width:100px;">
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-primary btn-sm" onclick="ATLAS.pagerPage.saveGotifyConfig()">${t('save')}</button>
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.pagerPage.testGotify()">🔔 Test Gotify</button>
        </div>
      </div>

      <!-- Active channels summary -->
      <div class="card" style="padding:16px;">
        <div style="font-weight:600;margin-bottom:10px;">📋 ${t('channels')}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${['webpush','ntfy','gotify','apprise','dapnet'].map(ch => `
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
              <input type="checkbox" class="channel-check" value="${ch}" ${channels.includes(ch)?'checked':''}>
              ${ch === 'webpush' ? '🌐 Web Push' : ch === 'ntfy' ? '📱 ntfy' : ch === 'gotify' ? '🔔 Gotify' : ch === 'apprise' ? '🔗 Apprise' : '📟 DAPNET'}
            </label>`).join('')}
        </div>
        <button class="btn btn-primary btn-sm" style="margin-top:12px;" onclick="ATLAS.pagerPage.saveChannels()">${t('save')} ${t('channels')}</button>
      </div>`;
  },

  async saveNtfyConfig() {
    const ok = await ATLAS.api.put('/api/pager/config', {
      ntfy_enabled: document.getElementById('ntfy-enabled').checked ? 1 : 0,
      ntfy_url: document.getElementById('ntfy-url').value.trim(),
      ntfy_topic: document.getElementById('ntfy-topic').value.trim(),
      ntfy_token: document.getElementById('ntfy-token').value.trim(),
    });
    if (ok) { ATLAS.ui.toast(ATLAS.i18n.t('success'), 'success'); await this.loadConfig(); }
  },

  async testNtfy() {
    ATLAS.ui.toast('Testing ntfy…', 'info');
    const res = await ATLAS.api.post('/api/pager/ntfy/test', {});
    if (res?.ok) ATLAS.ui.toast('✅ ntfy OK', 'success');
    else ATLAS.ui.toast('❌ ntfy ' + ATLAS.i18n.t('pager_test_fail'), 'error');
  },

  async saveAppriseConfig() {
    const ok = await ATLAS.api.put('/api/pager/config', {
      apprise_enabled: document.getElementById('apprise-enabled').checked ? 1 : 0,
      apprise_urls: document.getElementById('apprise-urls').value.trim(),
    });
    if (ok) { ATLAS.ui.toast(ATLAS.i18n.t('success'), 'success'); await this.loadConfig(); }
  },

  async testApprise() {
    ATLAS.ui.toast('Testing Apprise…', 'info');
    const res = await ATLAS.api.post('/api/pager/apprise/test', {});
    if (res?.ok) ATLAS.ui.toast('✅ Apprise OK', 'success');
    else ATLAS.ui.toast('❌ Apprise ' + ATLAS.i18n.t('pager_test_fail'), 'error');
  },

  async saveGotifyConfig() {
    const ok = await ATLAS.api.put('/api/pager/config', {
      gotify_enabled: document.getElementById('gotify-enabled').checked ? 1 : 0,
      gotify_url: document.getElementById('gotify-url').value.trim(),
      gotify_token: document.getElementById('gotify-token').value.trim(),
      gotify_priority: parseInt(document.getElementById('gotify-priority').value) || 5,
    });
    if (ok) { ATLAS.ui.toast(ATLAS.i18n.t('success'), 'success'); await this.loadConfig(); }
  },

  async testGotify() {
    ATLAS.ui.toast('Testing Gotify…', 'info');
    const res = await ATLAS.api.post('/api/pager/gotify/test', {});
    if (res?.ok) ATLAS.ui.toast('✅ Gotify OK', 'success');
    else ATLAS.ui.toast('❌ Gotify ' + ATLAS.i18n.t('pager_test_fail'), 'error');
  },

  async saveChannels() {
    const checks = document.querySelectorAll('.channel-check');
    const channels = Array.from(checks).filter(c=>c.checked).map(c=>c.value);
    const ok = await ATLAS.api.put('/api/pager/config', { channels: JSON.stringify(channels) });
    if (ok) { ATLAS.ui.toast(ATLAS.i18n.t('success'), 'success'); await this.loadConfig(); }
  },
};

/* ============================================================
   Scheduler Page
============================================================ */
ATLAS.schedulerPage = {
  _items: [],

  async render(el) {
    const t = k => ATLAS.i18n.t(k);
    el.innerHTML = `
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
        <h2 style="margin:0;">🕐 ${t('scheduler')}</h2>
        <button class="btn btn-primary" onclick="ATLAS.schedulerPage.showCreateModal()">+ ${t('new_scheduled')}</button>
      </div>
      <div id="scheduler-list"><div style="text-align:center;padding:40px;color:var(--text-muted);">${t('loading')}</div></div>`;
    await this.refresh();
  },

  async refresh() {
    try {
      const res = await ATLAS.api.get('/api/scheduled');
      this._items = res?.items || [];
    } catch(e) { this._items = []; }
    this.renderList();
  },

  renderList() {
    const el = document.getElementById('scheduler-list');
    if (!el) return;
    const t = k => ATLAS.i18n.t(k);
    if (this._items.length === 0) {
      el.innerHTML = `<div class="card" style="padding:40px;text-align:center;color:var(--text-muted);">${t('no_data')}</div>`;
      return;
    }
    el.innerHTML = `<div style="display:flex;flex-direction:column;gap:12px;">
      ${this._items.map(item => this._itemCard(item)).join('')}
    </div>`;
  },

  _itemCard(item) {
    const t = k => ATLAS.i18n.t(k);
    const sev = item.severity || 'info';
    const sevColor = sev==='critical'?'var(--danger)':sev==='warning'?'var(--warning)':'var(--accent)';
    const nextRun = item.next_run ? new Date(item.next_run).toLocaleString() : '—';
    const lastRun = item.last_run ? new Date(item.last_run).toLocaleString() : '—';
    return `<div class="card" style="padding:16px;border-left:3px solid ${sevColor};">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div style="flex:1;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <span style="font-weight:600;">${item.title}</span>
            <span class="badge badge-${sev==='critical'?'danger':sev==='warning'?'warning':'info'}">${sev}</span>
            <span class="badge ${item.enabled?'badge-success':'badge-muted'}">${item.enabled?t('enabled'):t('disabled')}</span>
            <span class="badge badge-muted">${item.type==='alert'?'🔔 Alert':'⚠️ Incident'}</span>
          </div>
          ${item.description ? `<div style="font-size:13px;color:var(--text-muted);margin-bottom:6px;">${item.description}</div>` : ''}
          <div style="font-size:11px;color:var(--text-muted);display:flex;gap:16px;flex-wrap:wrap;">
            <span>🔁 ${t('recurrence')}: <strong>${t(item.recurrence)||item.recurrence}</strong></span>
            <span>⏰ ${t('next_run')}: <strong>${nextRun}</strong></span>
            <span>✅ ${t('last_run')}: ${lastRun}</span>
            <span>📊 ${t('run_count')}: ${item.run_count||0}</span>
          </div>
        </div>
        <div style="display:flex;gap:6px;flex-shrink:0;margin-left:12px;">
          <button class="btn btn-secondary btn-sm" title="${t('run_now')}" onclick="ATLAS.schedulerPage.runNow(${item.id})">▶</button>
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.schedulerPage.toggle(${item.id}, ${item.enabled?0:1})">${item.enabled?'⏸':'▶'}</button>
          <button class="btn btn-secondary btn-sm" onclick="ATLAS.schedulerPage.showEditModal(${item.id})">✏</button>
          <button class="btn btn-danger btn-sm" onclick="ATLAS.schedulerPage.deleteItem(${item.id})">🗑</button>
        </div>
      </div>
    </div>`;
  },

  showCreateModal() {
    ATLAS.schedulerPage._showFormModal(null);
  },

  showEditModal(id) {
    const item = this._items.find(i => i.id === id);
    if (item) ATLAS.schedulerPage._showFormModal(item);
  },

  _showFormModal(item) {
    const t = k => ATLAS.i18n.t(k);
    const isEdit = !!item;
    const nextRun = item?.next_run ? item.next_run.slice(0,16) : new Date(Date.now()+60000).toISOString().slice(0,16);
    ATLAS.ui.modal('', `
      <div style="padding:20px;min-width:340px;max-width:520px;">
        <h3 style="margin:0 0 16px;">${isEdit ? t('edit') : t('new_scheduled')}</h3>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div>
            <label class="form-label">${t('type')}</label>
            <select id="sched-type" class="form-select">
              <option value="alert" ${(item?.type||'alert')==='alert'?'selected':''}>🔔 ${t('schedule_alert')}</option>
              <option value="incident" ${item?.type==='incident'?'selected':''}>⚠️ ${t('schedule_incident')}</option>
            </select>
          </div>
          <div>
            <label class="form-label">${t('title')}</label>
            <input type="text" id="sched-title" class="form-input" value="${item?.title||''}" placeholder="${t('title')}">
          </div>
          <div>
            <label class="form-label">${t('description')} (${t('details')})</label>
            <textarea id="sched-desc" class="form-input" rows="2">${item?.description||''}</textarea>
          </div>
          <div>
            <label class="form-label">${t('severity')}</label>
            <select id="sched-severity" class="form-select">
              <option value="critical" ${item?.severity==='critical'?'selected':''}>🔴 ${t('critical')}</option>
              <option value="warning" ${(item?.severity||'warning')==='warning'?'selected':''}>🟡 ${t('warning')}</option>
              <option value="info" ${item?.severity==='info'?'selected':''}>🔵 ${t('info')}</option>
            </select>
          </div>
          <div>
            <label class="form-label">${t('recurrence')}</label>
            <select id="sched-recurrence" class="form-select" onchange="ATLAS.schedulerPage._toggleIntervalField()">
              <option value="once" ${(item?.recurrence||'once')==='once'?'selected':''}>📅 ${t('once')}</option>
              <option value="daily" ${item?.recurrence==='daily'?'selected':''}>🔁 ${t('daily')}</option>
              <option value="weekly" ${item?.recurrence==='weekly'?'selected':''}>📆 ${t('weekly')}</option>
              <option value="hourly" ${item?.recurrence==='hourly'?'selected':''}>⏰ ${t('hourly')}</option>
              <option value="interval" ${item?.recurrence==='interval'?'selected':''}>⏱ ${t('interval')}</option>
            </select>
          </div>
          <div id="sched-interval-field" style="display:${item?.recurrence==='interval'?'block':'none'};">
            <label class="form-label">${t('interval_minutes')}</label>
            <input type="number" id="sched-interval" class="form-input" value="${(()=>{try{return JSON.parse(item?.recurrence_data||'{}').minutes||60;}catch{return 60;}})()}" min="1">
          </div>
          <div>
            <label class="form-label">${t('next_run')}</label>
            <input type="datetime-local" id="sched-next-run" class="form-input" value="${nextRun}">
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <input type="checkbox" id="sched-enabled" ${(item?.enabled??1)?'checked':''}>
            <label for="sched-enabled">${t('enabled')}</label>
          </div>
        </div>
        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:20px;">
          <button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${t('cancel')}</button>
          <button class="btn btn-primary" onclick="ATLAS.schedulerPage.saveItem(${isEdit?item.id:0})">${t('save')}</button>
        </div>
      </div>`);
    this._toggleIntervalField();
  },

  _toggleIntervalField() {
    const rec = document.getElementById('sched-recurrence')?.value;
    const f = document.getElementById('sched-interval-field');
    if (f) f.style.display = rec === 'interval' ? 'block' : 'none';
  },

  async saveItem(id) {
    const type = document.getElementById('sched-type').value;
    const title = document.getElementById('sched-title').value.trim();
    const description = document.getElementById('sched-desc').value.trim();
    const severity = document.getElementById('sched-severity').value;
    const recurrence = document.getElementById('sched-recurrence').value;
    const next_run = document.getElementById('sched-next-run').value.replace('T',' ');
    const enabled = document.getElementById('sched-enabled').checked ? 1 : 0;
    const intervalMin = parseInt(document.getElementById('sched-interval')?.value||60);
    const recurrence_data = recurrence === 'interval' ? JSON.stringify({minutes: intervalMin}) : '{}';
    if (!title) return ATLAS.ui.toast(ATLAS.i18n.t('error') + ': title required', 'error');
    const body = { type, title, description, severity, recurrence, recurrence_data, next_run, enabled };
    const res = (id && id !== 0) ? await ATLAS.api.put(`/api/scheduled/${id}`, body)
                                 : await ATLAS.api.post('/api/scheduled', body);
    if (res?.ok || res?.id) {
      ATLAS.ui.toast(ATLAS.i18n.t('success'), 'success');
      ATLAS.ui.closeModal();
      await this.refresh();
    }
  },

  async runNow(id) {
    const res = await ATLAS.api.post(`/api/scheduled/${id}/run-now`, {});
    if (res?.ok) { ATLAS.ui.toast('▶ ' + ATLAS.i18n.t('run_now') + ' OK', 'success'); await this.refresh(); }
    else ATLAS.ui.toast(ATLAS.i18n.t('error'), 'error');
  },

  async toggle(id, enabled) {
    try {
      await ATLAS.api.put(`/api/scheduled/${id}`, { enabled });
      await this.refresh();
    } catch(e) {
      ATLAS.ui.toast(ATLAS.i18n.t('error'), 'error');
    }
  },

  async deleteItem(id) {
    if (!confirm(ATLAS.i18n.t('delete') + '?')) return;
    const res = await ATLAS.api.delete(`/api/scheduled/${id}`);
    if (res?.ok) { ATLAS.ui.toast(ATLAS.i18n.t('success'), 'success'); await this.refresh(); }
    else ATLAS.ui.toast(ATLAS.i18n.t('error'), 'error');
  },
};

/* ============================================================
   Weather Page
============================================================ */
ATLAS.weatherPage = {
  _wmoDesc: {0:'Clear sky',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',45:'Foggy',48:'Icy fog',51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',71:'Light snow',73:'Snow',75:'Heavy snow',80:'Showers',81:'Heavy showers',95:'Thunderstorm',96:'Thunderstorm + hail',99:'Heavy thunderstorm'},
  _wmoIcon: {0:'☀️',1:'🌤',2:'⛅',3:'☁️',45:'🌫',48:'🌫',51:'🌦',53:'🌧',55:'🌧',61:'🌧',63:'🌧',65:'🌧',71:'🌨',73:'❄️',75:'❄️',80:'🌦',81:'🌧',95:'⛈️',96:'⛈️',99:'⛈️'},

  async render(el) {
    const t = k => ATLAS.i18n.t(k);
    el.innerHTML = `
      <div class="page-header">
        <h1>🌤 ${t('weather')}</h1>
        <div class="actions">
          <input id="weather-lat" class="form-input" style="width:100px;" placeholder="Lat" value="51.5">
          <input id="weather-lon" class="form-input" style="width:100px;" placeholder="Lon" value="9.0">
          <button class="btn btn-primary btn-sm" onclick="ATLAS.weatherPage.load()">🔄 ${t('refresh')}</button>
        </div>
      </div>
      <div id="weather-content"><div style="text-align:center;padding:60px;color:var(--text-muted);">Loading weather data...</div></div>`;
    await this.load();
  },

  async load() {
    const lat = parseFloat(document.getElementById('weather-lat')?.value || 51.5);
    const lon = parseFloat(document.getElementById('weather-lon')?.value || 9.0);
    const el = document.getElementById('weather-content');
    if (!el) return;
    el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);">⏳ Loading...</div>';
    try {
      const data = await ATLAS.api.get(`/api/weather?lat=${lat}&lon=${lon}`);
      if (data?.error) { el.innerHTML = `<div class="card" style="color:var(--danger);">Error: ${data.error}</div>`; return; }
      this._render(el, data, lat, lon);
    } catch(e) {
      el.innerHTML = `<div class="card" style="color:var(--danger);">Failed to load weather: ${e.message}</div>`;
    }
  },

  _render(el, data, lat, lon) {
    const t = k => ATLAS.i18n.t(k);
    const cur = data.current || {};
    const daily = data.daily || {};
    const hourly = data.hourly || {};
    const wcode = cur.weathercode || 0;
    const icon = this._wmoIcon[wcode] || '🌡️';
    const desc = this._wmoDesc[wcode] || '';
    // Current conditions
    const curHtml = `<div class="card" style="padding:24px;">
      <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;">
        <div style="font-size:72px;line-height:1;">${icon}</div>
        <div>
          <div style="font-size:48px;font-weight:800;">${cur.temperature_2m?.toFixed(1) ?? '–'}°C</div>
          <div style="font-size:16px;color:var(--text-muted);">${desc}</div>
          <div style="font-size:13px;color:var(--text-muted);margin-top:4px;">
            ${t('feels_like')}: ${cur.apparent_temperature?.toFixed(1) ?? '–'}°C &nbsp;|&nbsp;
            ${t('humidity')}: ${cur.relative_humidity_2m ?? '–'}% &nbsp;|&nbsp;
            ${t('wind')}: ${cur.wind_speed_10m?.toFixed(1) ?? '–'} km/h
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">📍 ${lat}, ${lon}</div>
        </div>
      </div>
    </div>`;
    // 7-day forecast
    const days = (daily.time || []).slice(0,7);
    const maxTemps = daily.temperature_2m_max || [];
    const minTemps = daily.temperature_2m_min || [];
    const precips = daily.precipitation_sum || [];
    const wcodes = daily.weathercode || [];
    const forecastHtml = `<div class="card">
      <div class="card-title">📅 7-Day ${t('weather_forecast')}</div>
      <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;">
        ${days.map((d,i) => {
          const dayName = new Date(d).toLocaleDateString(ATLAS.i18n.lang, {weekday:'short',month:'short',day:'numeric'});
          const ic = this._wmoIcon[wcodes[i]] || '🌡️';
          return `<div style="min-width:100px;text-align:center;padding:12px 8px;background:var(--bg-input);border-radius:var(--radius-sm);flex:1;">
            <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px;">${dayName}</div>
            <div style="font-size:28px;">${ic}</div>
            <div style="font-weight:700;">${(maxTemps[i]||0).toFixed(0)}°</div>
            <div style="color:var(--text-muted);font-size:12px;">${(minTemps[i]||0).toFixed(0)}°</div>
            <div style="font-size:11px;color:var(--info);margin-top:2px;">💧 ${(precips[i]||0).toFixed(1)}mm</div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
    el.innerHTML = curHtml + forecastHtml;
  },
};

/* ============================================================
   Calendar Page
============================================================ */
ATLAS.calendarPage = {
  _events: [],
  _view: 'month',
  _current: new Date(),

  async render(el) {
    const t = k => ATLAS.i18n.t(k);
    el.innerHTML = `
      <div class="page-header">
        <h1>📅 ${t('calendar')}</h1>
        <div class="actions">
          <button class="btn btn-primary btn-sm" onclick="ATLAS.calendarPage.showCreate()">+ ${t('new_event')}</button>
        </div>
      </div>
      <div class="grid-2">
        <div>
          <div class="card" style="padding:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
              <button class="btn btn-secondary btn-sm" onclick="ATLAS.calendarPage.prevMonth()">‹</button>
              <div id="cal-month-label" style="font-weight:700;font-size:16px;"></div>
              <button class="btn btn-secondary btn-sm" onclick="ATLAS.calendarPage.nextMonth()">›</button>
            </div>
            <div id="cal-grid"></div>
          </div>
        </div>
        <div>
          <div id="cal-events-panel">
            <div class="card"><div style="text-align:center;padding:30px;color:var(--text-muted);">Click a day to see events</div></div>
          </div>
        </div>
      </div>
      <div class="card" style="margin-top:16px;">
        <div class="card-title">📋 All Events / Requests</div>
        <div id="cal-list"></div>
      </div>`;
    await this.load();
  },

  async load() {
    this._events = await ATLAS.api.get('/api/calendar') || [];
    this.renderCalendar();
    this.renderList();
  },

  renderCalendar() {
    const label = document.getElementById('cal-month-label');
    const grid = document.getElementById('cal-grid');
    if (!label || !grid) return;
    const y = this._current.getFullYear(), m = this._current.getMonth();
    label.textContent = this._current.toLocaleDateString(ATLAS.i18n.lang, {month:'long',year:'numeric'});
    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m+1, 0).getDate();
    const days = ['Su','Mo','Tu','We','Th','Fr','Sa'];
    let html = `<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;text-align:center;">
      ${days.map(d=>`<div style="font-size:11px;color:var(--text-muted);padding:4px;font-weight:600;">${d}</div>`).join('')}`;
    for (let i=0;i<firstDay;i++) html += '<div></div>';
    for (let d=1;d<=daysInMonth;d++) {
      const dateStr = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const evts = this._events.filter(e => e.start_date <= dateStr && e.end_date >= dateStr);
      const dots = evts.slice(0,3).map(e => {
        const color = e.type==='vacation'?'var(--info)':e.type==='duty'?'var(--success)':'var(--accent)';
        return `<span style="width:5px;height:5px;background:${color};border-radius:50%;display:inline-block;"></span>`;
      }).join('');
      const isToday = dateStr === new Date().toISOString().slice(0,10);
      html += `<div onclick="ATLAS.calendarPage.selectDay('${dateStr}')" style="padding:4px 2px;border-radius:4px;cursor:pointer;${isToday?'background:var(--accent);color:white;font-weight:700;':''}" onmouseover="this.style.background='var(--nav-hover-bg)'" onmouseout="this.style.background='${isToday?'var(--accent)':'transparent'}'">
        <div style="font-size:13px;">${d}</div>
        <div style="display:flex;justify-content:center;gap:2px;min-height:6px;">${dots}</div>
      </div>`;
    }
    html += '</div>';
    grid.innerHTML = html;
  },

  selectDay(dateStr) {
    const evts = this._events.filter(e => e.start_date <= dateStr && e.end_date >= dateStr);
    const panel = document.getElementById('cal-events-panel');
    if (!panel) return;
    const t = k => ATLAS.i18n.t(k);
    if (evts.length === 0) {
      panel.innerHTML = `<div class="card"><div style="text-align:center;padding:20px;color:var(--text-muted);">${t('no_data')}</div></div>`;
    } else {
      panel.innerHTML = `<div class="card"><div class="card-title">${new Date(dateStr).toLocaleDateString(ATLAS.i18n.lang)}</div><div style="display:flex;flex-direction:column;gap:8px;">
        ${evts.map(e => this._eventRow(e)).join('')}
      </div></div>`;
    }
  },

  renderList() {
    const el = document.getElementById('cal-list');
    if (!el) return;
    const t = k => ATLAS.i18n.t(k);
    if (this._events.length === 0) {
      el.innerHTML = `<div style="padding:20px;text-align:center;color:var(--text-muted);">${t('no_data')}</div>`;
      return;
    }
    el.innerHTML = `<div style="display:flex;flex-direction:column;gap:6px;">
      ${this._events.map(e => this._eventRow(e)).join('')}
    </div>`;
  },

  _eventRow(e) {
    const t = k => ATLAS.i18n.t(k);
    const typeColor = e.type==='vacation'?'var(--info)':e.type==='duty'?'var(--success)':'var(--accent)';
    const statusColor = e.status==='approved'?'var(--success)':e.status==='rejected'?'var(--danger)':'var(--warning)';
    const canManage = ATLAS.state.user?.role === 'admin' || ATLAS.state.user?.role === 'operator';
    return `<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:var(--radius-sm);border-left:3px solid ${typeColor};background:var(--bg-input);">
      <div style="flex:1;">
        <div style="font-weight:600;font-size:14px;">${e.title}</div>
        <div style="font-size:12px;color:var(--text-muted);">
          ${e.user_name||'–'} &nbsp;|&nbsp; ${e.start_date}${e.end_date&&e.end_date!==e.start_date?' → '+e.end_date:''} &nbsp;|&nbsp;
          <span style="color:${typeColor};">${t(e.type)||e.type}</span>
        </div>
      </div>
      <span class="badge" style="background:${statusColor};color:white;">${t(e.status)||e.status}</span>
      ${canManage && e.status==='pending' ? `
        <button class="btn btn-success btn-sm" onclick="ATLAS.calendarPage.approve(${e.id})">✓</button>
        <button class="btn btn-danger btn-sm" onclick="ATLAS.calendarPage.reject(${e.id})">✗</button>` : ''}
      <button class="btn btn-secondary btn-sm" onclick="ATLAS.calendarPage.deleteEvent(${e.id})">🗑</button>
    </div>`;
  },

  prevMonth() { this._current = new Date(this._current.getFullYear(), this._current.getMonth()-1, 1); this.renderCalendar(); },
  nextMonth() { this._current = new Date(this._current.getFullYear(), this._current.getMonth()+1, 1); this.renderCalendar(); },

  showCreate() {
    const t = k => ATLAS.i18n.t(k);
    const today = new Date().toISOString().slice(0,10);
    ATLAS.ui.modal(`📅 ${t('new_event')}`, `
      <div class="form-group"><label class="form-label">${t('title')}</label><input id="cal-title" class="form-input" placeholder="${t('title')}"></div>
      <div class="form-group"><label class="form-label">${t('type')}</label>
        <select id="cal-type" class="form-select">
          <option value="event">${t('event')}</option>
          <option value="vacation">${t('vacation')}</option>
          <option value="duty">${t('duty')}</option>
        </select>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Start ${t('date')}</label><input id="cal-start" class="form-input" type="date" value="${today}"></div>
        <div class="form-group"><label class="form-label">End ${t('date')}</label><input id="cal-end" class="form-input" type="date" value="${today}"></div>
      </div>
      <div class="form-group"><label class="form-label">${t('description')}</label><input id="cal-desc" class="form-input" placeholder="${t('description')}"></div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.calendarPage.save()">+ ${t('save')}</button>`
    );
  },

  async save() {
    const title = document.getElementById('cal-title').value.trim();
    const type = document.getElementById('cal-type').value;
    const start_date = document.getElementById('cal-start').value;
    const end_date = document.getElementById('cal-end').value;
    const description = document.getElementById('cal-desc').value.trim();
    if (!title || !start_date) return ATLAS.ui.toast('Title and start date required', 'warning');
    try {
      await ATLAS.api.post('/api/calendar', { title, type, start_date, end_date, description });
      ATLAS.ui.closeModal();
      ATLAS.ui.toast(ATLAS.i18n.t('success'), 'success');
      await this.load();
    } catch(e) { ATLAS.ui.toast(e.message, 'error'); }
  },

  async approve(id) {
    await ATLAS.api.put(`/api/calendar/${id}`, { status: 'approved' });
    await this.load();
  },

  async reject(id) {
    await ATLAS.api.put(`/api/calendar/${id}`, { status: 'rejected' });
    await this.load();
  },

  async deleteEvent(id) {
    if (!confirm(ATLAS.i18n.t('delete') + '?')) return;
    await ATLAS.api.delete(`/api/calendar/${id}`);
    await this.load();
  },
};

/* ============================================================
   Travel Requests Page
============================================================ */
ATLAS.travelPage = {
  _items: [],
  _vehicles: [],

  async render(el) {
    const t = k => ATLAS.i18n.t(k);
    el.innerHTML = `
      <div class="page-header">
        <h1>✈️ ${t('travel')}</h1>
        <div class="actions">
          <button class="btn btn-primary btn-sm" onclick="ATLAS.travelPage.showCreate()">+ ${t('new_travel')}</button>
        </div>
      </div>
      <div id="travel-list"><div style="text-align:center;padding:40px;color:var(--text-muted);">Loading...</div></div>`;
    await this.load();
  },

  async load() {
    [this._items, this._vehicles] = await Promise.all([
      ATLAS.api.get('/api/travel').catch(()=>[]),
      ATLAS.api.get('/api/fleet/vehicles').catch(()=>[]),
    ]);
    this.renderList();
  },

  renderList() {
    const el = document.getElementById('travel-list');
    if (!el) return;
    const t = k => ATLAS.i18n.t(k);
    if (this._items.length === 0) {
      el.innerHTML = `<div class="card" style="padding:40px;text-align:center;color:var(--text-muted);">${t('no_data')}</div>`;
      return;
    }
    el.innerHTML = `<div style="display:flex;flex-direction:column;gap:10px;">
      ${this._items.map(r => this._row(r)).join('')}
    </div>`;
  },

  _row(r) {
    const t = k => ATLAS.i18n.t(k);
    const me = ATLAS.state.user;
    const isManager = me?.role === 'admin' || me?.role === 'operator';
    const isMine = r.requester_id === me?.id;
    const statusColor = r.status==='approved'?'var(--success)':r.status==='rejected'?'var(--danger)':r.status==='pending'?'var(--warning)':'var(--info)';
    const ttype = { car:'🚗 Car', aircraft:'✈️ Aircraft', jet:'🛩 Jet', ship:'🚢 Ship', motorcycle:'🏍️ Motorcycle' };
    return `<div class="card" style="padding:14px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;">
        <div style="flex:1;min-width:200px;">
          <div style="font-weight:700;font-size:15px;margin-bottom:4px;">${r.title}</div>
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px;">
            📍 ${r.destination} &nbsp;|&nbsp; 📅 ${r.start_date} → ${r.end_date} &nbsp;|&nbsp;
            ${ttype[r.travel_type]||r.travel_type} &nbsp;|&nbsp;
            ${r.requester_name||'–'}
          </div>
          ${r.vehicle_name?`<div style="font-size:12px;color:var(--text-muted);">🚗 ${r.vehicle_name}</div>`:''}
          ${r.reviewer_notes?`<div style="font-size:12px;color:var(--text-muted);margin-top:4px;font-style:italic;">Note: ${r.reviewer_notes}</div>`:''}
          ${r.notes?`<div style="font-size:12px;color:var(--text-muted);">${r.notes}</div>`:''}
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">
          <span class="badge" style="background:${statusColor};color:white;">${t(r.status)||r.status}</span>
          ${isManager && r.status==='pending'?`
            <button class="btn btn-success btn-sm" onclick="ATLAS.travelPage.approve(${r.id})">✓ ${t('approve')}</button>
            <button class="btn btn-secondary btn-sm" onclick="ATLAS.travelPage.showCounterOffer(${r.id})">💬 Counter</button>
            <button class="btn btn-danger btn-sm" onclick="ATLAS.travelPage.reject(${r.id})">✗ ${t('reject')}</button>` : ''}
          ${isMine && r.status==='pending'?`<button class="btn btn-danger btn-sm" onclick="ATLAS.travelPage.delete(${r.id})">🗑</button>`:''}
          ${isMine && r.status==='rejected'?`<button class="btn btn-danger btn-sm" onclick="ATLAS.travelPage.rejectCounterOffer(${r.id})">🗑 ${t('reject_counteroffer')}</button>`:''}
        </div>
      </div>
    </div>`;
  },

  showCreate() {
    const t = k => ATLAS.i18n.t(k);
    const today = new Date().toISOString().slice(0,10);
    const vOpts = this._vehicles.map(v => `<option value="${v.id}">${v.name} (${v.license_plate||'–'})</option>`).join('');
    ATLAS.ui.modal(`✈️ ${t('new_travel')}`, `
      <div class="form-group"><label class="form-label">${t('title')}</label><input id="tr-title" class="form-input" placeholder="${t('title')}"></div>
      <div class="form-group"><label class="form-label">${t('destination')}</label><input id="tr-dest" class="form-input" placeholder="City, address…"></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">${t('departure')}</label><input id="tr-start" class="form-input" type="date" value="${today}"></div>
        <div class="form-group"><label class="form-label">${t('arrival')}</label><input id="tr-end" class="form-input" type="date" value="${today}"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">${t('travel_type')}</label>
          <select id="tr-type" class="form-select">
            <option value="car">🚗 Car</option>
            <option value="aircraft">✈️ Aircraft</option>
            <option value="jet">🛩 Jet</option>
            <option value="ship">🚢 Ship</option>
            <option value="motorcycle">🏍️ Motorcycle</option>
            <option value="bus">🚌 Bus</option>
          </select>
        </div>
        <div class="form-group"><label class="form-label">${t('vehicle')} (optional)</label>
          <select id="tr-vehicle" class="form-select">
            <option value="">– None –</option>
            ${vOpts}
          </select>
        </div>
      </div>
      <div style="display:flex;gap:16px;margin:8px 0;">
        <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;">
          <input type="checkbox" id="tr-solo" checked> ${t('solo')}</label>
        <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;">
          <input type="checkbox" id="tr-crew"> ${t('with_crew')}</label>
      </div>
      <div class="form-group"><label class="form-label">${t('description')}</label><textarea id="tr-notes" class="form-textarea" rows="2" placeholder="Notes…"></textarea></div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.travelPage.save()">+ ${t('save')}</button>`,
      'modal-lg'
    );
  },

  async save() {
    const title = document.getElementById('tr-title').value.trim();
    const destination = document.getElementById('tr-dest').value.trim();
    if (!title || !destination) return ATLAS.ui.toast('Title and destination required', 'warning');
    const vid = document.getElementById('tr-vehicle').value;
    try {
      await ATLAS.api.post('/api/travel', {
        title, destination,
        start_date: document.getElementById('tr-start').value,
        end_date: document.getElementById('tr-end').value,
        travel_type: document.getElementById('tr-type').value,
        vehicle_id: vid ? parseInt(vid) : null,
        solo: document.getElementById('tr-solo').checked,
        with_crew: document.getElementById('tr-crew').checked,
        notes: document.getElementById('tr-notes').value.trim(),
      });
      ATLAS.ui.closeModal();
      ATLAS.ui.toast(ATLAS.i18n.t('success'), 'success');
      await this.load();
    } catch(e) { ATLAS.ui.toast(e.message, 'error'); }
  },

  async approve(id) {
    await ATLAS.api.put(`/api/travel/${id}`, { status: 'approved' });
    ATLAS.ui.toast('Travel request approved', 'success');
    await this.load();
  },

  async reject(id) {
    await ATLAS.api.put(`/api/travel/${id}`, { status: 'rejected' });
    await this.load();
  },

  showCounterOffer(id) {
    const t = k => ATLAS.i18n.t(k);
    ATLAS.ui.modal('💬 Counter Offer', `
      <div class="form-group"><label class="form-label">${t('reviewer_notes')}</label>
        <textarea id="tr-counter-note" class="form-textarea" rows="3" placeholder="Suggest alternative dates or conditions…"></textarea>
      </div>`,
      `<button class="btn btn-secondary" onclick="ATLAS.ui.closeModal()">${t('cancel')}</button>
       <button class="btn btn-primary" onclick="ATLAS.travelPage.sendCounterOffer(${id})">${t('send')}</button>`
    );
  },

  async sendCounterOffer(id) {
    const note = document.getElementById('tr-counter-note').value.trim();
    await ATLAS.api.put(`/api/travel/${id}`, { status: 'rejected', reviewer_notes: note });
    ATLAS.ui.closeModal();
    ATLAS.ui.toast('Counter offer sent', 'success');
    await this.load();
  },

  async rejectCounterOffer(id) {
    if (!confirm(ATLAS.i18n.t('delete') + '?')) return;
    await ATLAS.api.put(`/api/travel/${id}`, { action: 'reject_counteroffer' });
    await this.load();
  },

  async delete(id) {
    if (!confirm(ATLAS.i18n.t('delete') + '?')) return;
    await ATLAS.api.delete(`/api/travel/${id}`);
    await this.load();
  },
};

/* ============================================================
   Bootstrap – runs after DOM + scripts are ready
============================================================ */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ATLAS.init());
} else {
  ATLAS.init();
}

