# Git a GitHub příkazy a postupy

## Základní Git příkazy

### Začínáme s Gitem

- `git init` - Inicializace nového Git repozitáře
- `git clone <url>` - Klonování vzdáleného repozitáře
- `git status` - Zobrazení stavu pracovního adresáře
- `git add <soubor>` - Přidání souboru do stage
- `git commit -m "zpráva"` - Vytvoření commitu se zprávou
- `git push` - Odeslání změn na vzdálený server
- `git pull` - Stažení změn ze vzdáleného serveru

### Větve (branches)

- `git branch` - Seznam větví
- `git branch <název>` - Vytvoření nové větve
- `git checkout <větev>` - Přepnutí na jinou větev
- `git merge <větev>` - Sloučení větví

### Pokročilé příkazy

- `git stash` - Dočasné uložení rozpracovaných změn
- `git reset` - Vrácení změn
- `git rebase` - Přeskládání historie commitů
- `git tag` - Správa tagů/značek

### Konfigurace

- `git config --global user.name "Jméno"` - Nastavení jména
- `git config --global user.email "email@domena.cz"` - Nastavení emailu

## Workflow s GitHubem a Vercelem

### Struktura větví

- **`main`** - Produkční větev obsahující stabilní kód připravený k nasazení
- **`dev`/`feature`** - Vývojové větve pro práci na nových funkcích

### Typický postup práce

1. **Příprava pracovního prostředí**
   ```bash
   git checkout dev  # Přepnutí na vývojovou větev
   ```

2. **Vývoj nových funkcí**
   - Vytvoření/úprava souborů
   - Přidání změn do stage a vytvoření commitu:
   ```bash
   git add .
   git commit -m "Popis provedených změn"
   ```

3. **Synchronizace s main větví**
   ```bash
   git checkout dev
   git pull origin main
   ```

4. **Testování**
   - Lokální testování změn
   - Využití Vercel preview (pokud je k dispozici)

5. **Nasazení změn**
   ```bash
   git checkout main
   git merge dev
   git push origin main
   ```

### Tipy pro efektivní práci

- Používejte výstižné commit zprávy
- Pravidelně synchronizujte s hlavní větví
- Využívejte .gitignore pro vyloučení nepotřebných souborů
- Před každým push proveďte pull
- Testujte změny před sloučením do main větve