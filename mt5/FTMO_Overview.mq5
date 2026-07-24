//+------------------------------------------------------------------+
//|                                               FTMO_Overview.mq5   |
//|  Panneau d'apercu de challenge FTMO pour le terminal MT5.         |
//|                                                                  |
//|  - S'affiche en haut a gauche du graphique.                      |
//|  - S'adapte automatiquement au compte connecte (solde initial    |
//|    detecte via l'historique, ou surcharge par compte).           |
//|  - Reprend les metriques du dashboard FTMO :                     |
//|      Balance, Equity, Unrealized PnL, Today's profit,            |
//|      + les 4 objectifs (jours de trading, perte journaliere,     |
//|      perte max / drawdown, objectif de profit).                  |
//|                                                                  |
//|  Indicateur (fenetre principale, sans buffer) : il ne bloque     |
//|  pas un EA de trading et peut cohabiter avec d'autres outils.    |
//+------------------------------------------------------------------+
#property copyright   "Damien"
#property version     "1.00"
#property description "Apercu de challenge FTMO dans le terminal MT5"
#property indicator_chart_window
#property indicator_plots 0

//==================================================================
// Parametres
//==================================================================
input group "== Regles du challenge (% du solde initial) =="
input double InpProfitTargetPct = 10.0;   // Objectif de profit %  (Step1=10, Step2=5)
input double InpDailyLossPct     = 5.0;    // Perte journaliere max %
input double InpMaxLossPct        = 10.0;  // Perte max / drawdown %
input int    InpMinTradingDays   = 4;      // Jours de trading minimum

input group "== Solde initial =="
input double InpInitialBalance   = 0.0;    // Solde initial (0 = auto depuis l'historique)

input group "== Surcharge Compte A (optionnel) =="
input long   InpAcctA_Login      = 0;      // Login compte A (0 = desactive)
input double InpAcctA_Initial    = 0.0;    // Solde initial compte A (0 = auto)
input double InpAcctA_TargetPct  = 0.0;    // Objectif profit % compte A (0 = defaut)

input group "== Surcharge Compte B (optionnel) =="
input long   InpAcctB_Login      = 0;      // Login compte B (0 = desactive)
input double InpAcctB_Initial    = 0.0;    // Solde initial compte B (0 = auto)
input double InpAcctB_TargetPct  = 0.0;    // Objectif profit % compte B (0 = defaut)

input group "== Apparence =="
input int    InpX                = 12;     // Position X (px depuis la gauche)
input int    InpY                = 20;     // Position Y (px depuis le haut)
input int    InpFontSize         = 9;      // Taille de police
input string InpFont             = "Consolas"; // Police (monospace conseillee)
input color  InpBgColor          = C'22,26,34';   // Fond du panneau
input color  InpBorderColor      = C'55,62,74';   // Bordure
input color  InpTextColor        = C'210,214,220'; // Texte principal
input color  InpTitleColor       = C'96,190,170';  // Titre
input color  InpOkColor          = C'40,190,120';  // Objectif atteint
input color  InpFailColor        = C'235,90,90';   // Objectif non atteint
input color  InpProfitColor      = C'40,190,120';  // Gain
input color  InpLossColor        = C'235,90,90';   // Perte
input int    InpRefreshSeconds   = 1;      // Rafraichissement (secondes)

//==================================================================
// Constantes internes
//==================================================================
#define PREFIX     "FTMO_OVW_"
#define ROWS       10          // nombre de lignes de texte
#define LINE_H     16          // hauteur d'une ligne (px)
#define PAD        10          // marge interne (px)
#define PANEL_W    290         // largeur du panneau (px)
#define ICON_W     16          // largeur reservee a l'icone d'objectif

// Wingdings : coche et croix
#define GLYPH_OK   252   // ü -> coche
#define GLYPH_FAIL 251   // û -> croix

string g_currency = "";

//+------------------------------------------------------------------+
//| Initialisation                                                   |
//+------------------------------------------------------------------+
int OnInit()
{
   g_currency = AccountInfoString(ACCOUNT_CURRENCY);
   BuildPanel();
   EventSetTimer(MathMax(1, InpRefreshSeconds));
   Refresh();
   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Deinitialisation                                                 |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   EventKillTimer();
   ObjectsDeleteAll(0, PREFIX);
   ChartRedraw();
}

//+------------------------------------------------------------------+
//| Timer -> rafraichissement                                        |
//+------------------------------------------------------------------+
void OnTimer()
{
   Refresh();
}

//+------------------------------------------------------------------+
//| Recalcul sur tick (mise a jour immediate du flottant)            |
//+------------------------------------------------------------------+
int OnCalculate(const int rates_total,
                const int prev_calculated,
                const int begin,
                const double &price[])
{
   Refresh();
   return(rates_total);
}

//==================================================================
// Construction des objets graphiques (une seule fois)
//==================================================================
void BuildPanel()
{
   ObjectsDeleteAll(0, PREFIX);

   int panelH = PAD*2 + ROWS*LINE_H;

   // fond
   CreateRect(PREFIX+"bg", InpX, InpY, PANEL_W, panelH, InpBgColor, InpBorderColor);

   // lignes de texte + icones d'objectif
   for(int i=0; i<ROWS; i++)
   {
      int ly = InpY + PAD + i*LINE_H;
      CreateLabel(PREFIX+"txt"+(string)i, InpX+PAD, ly, "", InpTextColor, InpFontSize, InpFont);
      // icone d'objectif (lignes 6..9), en Wingdings
      if(i>=6)
         CreateLabel(PREFIX+"ico"+(string)i, InpX+PAD, ly, "", InpTextColor, InpFontSize+1, "Wingdings");
   }
   ChartRedraw();
}

//==================================================================
// Rafraichissement des valeurs
//==================================================================
void Refresh()
{
   long   login   = (long)AccountInfoInteger(ACCOUNT_LOGIN);
   double balance = AccountInfoDouble(ACCOUNT_BALANCE);
   double equity  = AccountInfoDouble(ACCOUNT_EQUITY);
   double floating= AccountInfoDouble(ACCOUNT_PROFIT); // PnL non realise

   // --- Determination des parametres du challenge (adaptes au compte) ---
   double targetPct = InpProfitTargetPct;
   double initOverride = InpInitialBalance;

   if(InpAcctA_Login!=0 && login==InpAcctA_Login)
   {
      if(InpAcctA_Initial   > 0) initOverride = InpAcctA_Initial;
      if(InpAcctA_TargetPct > 0) targetPct    = InpAcctA_TargetPct;
   }
   else if(InpAcctB_Login!=0 && login==InpAcctB_Login)
   {
      if(InpAcctB_Initial   > 0) initOverride = InpAcctB_Initial;
      if(InpAcctB_TargetPct > 0) targetPct    = InpAcctB_TargetPct;
   }

   // --- Analyse de l'historique ---
   double initFromHist = 0.0;
   double todayRealized = 0.0;
   int    tradingDays   = 0;
   ScanHistory(initFromHist, todayRealized, tradingDays);

   double initial = (initOverride > 0) ? initOverride : initFromHist;
   if(initial <= 0) initial = balance; // filet de securite

   // --- Metriques ---
   double dayStartBalance = balance - todayRealized;      // solde a 00:00 (exact via historique)
   double todayProfit     = equity - dayStartBalance;      // realise + flottant du jour
   double profitAbs       = equity - initial;              // progression vers l'objectif
   double overallLoss     = initial - equity;              // drawdown courant (positif = perte)

   double dailyLimit = InpDailyLossPct  /100.0 * initial;
   double maxLimit   = InpMaxLossPct    /100.0 * initial;
   double target     = targetPct        /100.0 * initial;

   bool okDays   = (tradingDays >= InpMinTradingDays);
   bool okDaily  = (todayProfit > -dailyLimit);   // equity au-dessus du plancher journalier
   bool okMax    = (equity > initial - maxLimit); // equity au-dessus du plancher global
   bool okTarget = (profitAbs >= target);

   // --- Rendu ---
   string cur = (g_currency=="" ? "" : g_currency+" ");

   SetText(0, "FTMO OVERVIEW", InpTitleColor);
   SetText(1, "Compte " + (string)login + "   Initial: " + Money(initial), InpTextColor);
   SetText(2, "Balance " + Money(balance) + "   Equity " + Money(equity), InpTextColor);
   SetText(3, "Unrealized PnL  " + Signed(floating),
              floating>=0 ? InpProfitColor : InpLossColor);
   SetText(4, "Today's profit  " + Signed(todayProfit) + "  " + Pct(todayProfit, initial),
              todayProfit>=0 ? InpProfitColor : InpLossColor);
   SetText(5, "----------------------------------------", InpBorderColor);

   // Objectifs
   SetObjective(6, okDays,
      "Jours trades   " + (string)tradingDays + " / " + (string)InpMinTradingDays, true);
   SetObjective(7, okDaily,
      "Perte j. max   " + Signed(todayProfit) + " / " + Money(dailyLimit) + " " + Pct(todayProfit, initial), false);
   SetObjective(8, okMax,
      "Perte max      " + Signed(-overallLoss) + " / " + Money(maxLimit) + " " + Pct(-overallLoss, initial), false);
   SetObjective(9, okTarget,
      "Objectif       " + Money(profitAbs) + " / " + Money(target) + " " + Pct(profitAbs, initial), false);

   ChartRedraw();
}

//==================================================================
// Parcours de l'historique : solde initial, P/L realise du jour,
// nombre de jours de trading distincts.
//==================================================================
void ScanHistory(double &initialBalance, double &todayRealized, int &tradingDays)
{
   initialBalance = 0.0;
   todayRealized  = 0.0;
   tradingDays    = 0;

   datetime todayStart = DayStart(TimeCurrent());

   if(!HistorySelect(0, TimeCurrent()))
      return;

   long     seenDays[];   // index de jour (time/86400) deja comptes
   int      seenCount = 0;
   bool     initFound = false;

   int total = HistoryDealsTotal();
   for(int i=0; i<total; i++)
   {
      ulong ticket = HistoryDealGetTicket(i);
      if(ticket==0) continue;

      long   type = HistoryDealGetInteger(ticket, DEAL_TYPE);
      datetime t  = (datetime)HistoryDealGetInteger(ticket, DEAL_TIME);

      // Solde initial = premier depot (deal de type balance)
      if(type==DEAL_TYPE_BALANCE)
      {
         if(!initFound)
         {
            initialBalance = HistoryDealGetDouble(ticket, DEAL_PROFIT);
            initFound = true;
         }
         continue; // les operations de solde ne sont pas du trading
      }

      // Deals de marche uniquement (buy/sell)
      if(type!=DEAL_TYPE_BUY && type!=DEAL_TYPE_SELL)
         continue;

      double pl = HistoryDealGetDouble(ticket, DEAL_PROFIT)
                + HistoryDealGetDouble(ticket, DEAL_SWAP)
                + HistoryDealGetDouble(ticket, DEAL_COMMISSION)
                + HistoryDealGetDouble(ticket, DEAL_FEE);

      // P/L realise aujourd'hui
      if(t >= todayStart)
         todayRealized += pl;

      // Jours de trading distincts
      long dayIdx = (long)(t/86400);
      bool known = false;
      for(int k=0; k<seenCount; k++)
         if(seenDays[k]==dayIdx) { known=true; break; }
      if(!known)
      {
         ArrayResize(seenDays, seenCount+1);
         seenDays[seenCount] = dayIdx;
         seenCount++;
      }
   }

   tradingDays = seenCount;
}

//==================================================================
// Helpers
//==================================================================
datetime DayStart(datetime t)
{
   MqlDateTime dt;
   TimeToStruct(t, dt);
   dt.hour = 0; dt.min = 0; dt.sec = 0;
   return StructToTime(dt);
}

string Money(double v)
{
   return DoubleToString(v, 2);
}

string Signed(double v)
{
   return (v>=0 ? "+" : "-") + DoubleToString(MathAbs(v), 2);
}

string Pct(double v, double base)
{
   if(base<=0) return "";
   double p = v/base*100.0;
   return "(" + (p>=0?"+":"-") + DoubleToString(MathAbs(p),1) + "%)";
}

void SetText(int row, string text, color clr)
{
   string name = PREFIX+"txt"+(string)row;
   ObjectSetString(0, name, OBJPROP_TEXT, text);
   ObjectSetInteger(0, name, OBJPROP_COLOR, clr);
}

void SetObjective(int row, bool ok, string text, bool dummy)
{
   // icone
   string ico = PREFIX+"ico"+(string)row;
   ObjectSetString(0, ico, OBJPROP_TEXT, CharToString((uchar)(ok?GLYPH_OK:GLYPH_FAIL)));
   ObjectSetInteger(0, ico, OBJPROP_COLOR, ok?InpOkColor:InpFailColor);

   // texte decale a droite de l'icone
   string name = PREFIX+"txt"+(string)row;
   ObjectSetInteger(0, name, OBJPROP_XDISTANCE, InpX+PAD+ICON_W);
   ObjectSetString(0, name, OBJPROP_TEXT, text);
   ObjectSetInteger(0, name, OBJPROP_COLOR, ok?InpOkColor:InpFailColor);
}

//==================================================================
// Creation d'objets
//==================================================================
void CreateRect(string name, int x, int y, int w, int h, color bg, color border)
{
   ObjectCreate(0, name, OBJ_RECTANGLE_LABEL, 0, 0, 0);
   ObjectSetInteger(0, name, OBJPROP_CORNER, CORNER_LEFT_UPPER);
   ObjectSetInteger(0, name, OBJPROP_XDISTANCE, x);
   ObjectSetInteger(0, name, OBJPROP_YDISTANCE, y);
   ObjectSetInteger(0, name, OBJPROP_XSIZE, w);
   ObjectSetInteger(0, name, OBJPROP_YSIZE, h);
   ObjectSetInteger(0, name, OBJPROP_BGCOLOR, bg);
   ObjectSetInteger(0, name, OBJPROP_BORDER_TYPE, BORDER_FLAT);
   ObjectSetInteger(0, name, OBJPROP_COLOR, border);
   ObjectSetInteger(0, name, OBJPROP_WIDTH, 1);
   ObjectSetInteger(0, name, OBJPROP_BACK, false);
   ObjectSetInteger(0, name, OBJPROP_SELECTABLE, false);
   ObjectSetInteger(0, name, OBJPROP_HIDDEN, true);
   ObjectSetInteger(0, name, OBJPROP_ZORDER, 0);
}

void CreateLabel(string name, int x, int y, string text, color clr, int size, string font)
{
   ObjectCreate(0, name, OBJ_LABEL, 0, 0, 0);
   ObjectSetInteger(0, name, OBJPROP_CORNER, CORNER_LEFT_UPPER);
   ObjectSetInteger(0, name, OBJPROP_XDISTANCE, x);
   ObjectSetInteger(0, name, OBJPROP_YDISTANCE, y);
   ObjectSetInteger(0, name, OBJPROP_COLOR, clr);
   ObjectSetInteger(0, name, OBJPROP_FONTSIZE, size);
   ObjectSetString(0, name, OBJPROP_FONT, font);
   ObjectSetString(0, name, OBJPROP_TEXT, text);
   ObjectSetInteger(0, name, OBJPROP_SELECTABLE, false);
   ObjectSetInteger(0, name, OBJPROP_HIDDEN, true);
   ObjectSetInteger(0, name, OBJPROP_ZORDER, 1);
}
//+------------------------------------------------------------------+
