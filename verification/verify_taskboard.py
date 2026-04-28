from playwright.sync_api import sync_playwright
import os

def run_cuj(page):
    # 1. Login page
    page.goto("http://localhost:3000/auth/signin")
    page.wait_for_timeout(2000)

    # 2. Login as Admin
    page.get_by_text("Mode Démo (Admin Thibault)").click()
    page.wait_for_timeout(3000)

    # 3. Create a task as Admin (auto-published)
    # On clique sur le bouton pour ouvrir la modale
    page.get_by_text("Proposer une tâche").click()
    page.wait_for_timeout(2000)

    # Remplissage
    page.get_by_placeholder("Ex: Refonte du blog interne").fill("Migration Data Platform")
    page.get_by_placeholder("Décrivez les objectifs et les livrables attendus...").fill("Aider à la migration des données vers la nouvelle plateforme Cloud.")

    # On soumet
    page.get_by_role("button", name="Soumettre").click()

    # On attend que la modale disparaisse et que la carte apparaisse
    page.wait_for_timeout(5000)
    page.screenshot(path="verification/screenshots/09_final_board_result.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
