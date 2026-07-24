# FTMO Overview — panneau MT5

Indicateur MetaTrader 5 qui affiche, en haut à gauche du graphique, un aperçu
de ton challenge FTMO : Balance, Equity, Unrealized PnL, Today's profit, et les
4 objectifs (jours de trading, perte journalière max, perte max/drawdown,
objectif de profit) avec une coche verte / croix rouge comme sur le dashboard.

C'est un **indicateur** (pas un EA) : il ne bloque pas l'AutoTrading et peut
cohabiter avec un robot ou avec du trading manuel.

## Installation

1. Dans MT5 : `Fichier` → `Ouvrir le dossier de données`.
2. Copie `FTMO_Overview.mq5` dans `MQL5/Indicators/`.
3. Ouvre le fichier dans MetaEditor (F4) et compile (F7).
4. Dans MT5, `Navigateur` → `Indicateurs` → glisse **FTMO Overview** sur un
   graphique.

## Adaptation automatique aux deux comptes

Le panneau lit **l'historique du compte connecté** pour tout calculer, donc il
s'adapte tout seul au terminal ouvert :

- **Solde initial** = premier dépôt trouvé dans l'historique. Ça distingue
  automatiquement le compte 10 000 € du compte ~40 000 €, sans réglage.
- **Today's profit** = `equity − solde de début de journée`, où le solde de
  début de journée est reconstruit exactement (`balance − P/L réalisé du jour`).
  C'est la même valeur que la colonne « Today's profit » de FTMO.
- **Jours de trading** = nombre de journées distinctes avec au moins un trade.

### Si tes deux comptes n'ont pas le même palier

Seule chose que l'historique ne peut pas deviner : **Step 1 (10 %) vs Step 2
(5 %)** pour l'objectif de profit. Si tes deux comptes diffèrent, renseigne les
surcharges par login dans les paramètres :

| Paramètre           | Rôle                                            |
|---------------------|-------------------------------------------------|
| `InpAcctA_Login`    | Login du compte A                               |
| `InpAcctA_TargetPct`| Objectif de profit % pour ce compte (ex. 10)    |
| `InpAcctA_Initial`  | Force le solde initial (0 = auto)               |
| `InpAcctB_*`        | Idem pour le compte B                            |

Le panneau détecte le login connecté et applique la bonne surcharge. Laisse tout
à 0 si les deux comptes utilisent les mêmes règles (défaut : Step 1).

## Règles FTMO par défaut (paramètres)

| Paramètre             | Défaut | Signification                       |
|-----------------------|--------|-------------------------------------|
| `InpProfitTargetPct`  | 10 %   | Objectif de profit                  |
| `InpDailyLossPct`     | 5 %    | Perte journalière max               |
| `InpMaxLossPct`       | 10 %   | Perte max / drawdown                |
| `InpMinTradingDays`   | 4      | Jours de trading minimum            |

Pour un compte **Step 2**, passe `InpProfitTargetPct` (ou la surcharge du
compte) à `5`.

## Notes

- Le début de journée suit le **fuseau du serveur** de ton broker FTMO
  (généralement CE(S)T), comme le fait FTMO. Si ton serveur est décalé, la
  bascule journalière peut différer de quelques heures du dashboard.
- L'objectif de profit est mesuré sur l'**equity** (vue live). FTMO valide le
  palier une fois atteint ; considère la valeur comme indicative en cours de
  journée quand tu as des positions ouvertes.
- Apparence, position (`InpX`/`InpY`), couleurs et fréquence de rafraîchissement
  sont réglables dans les paramètres.
