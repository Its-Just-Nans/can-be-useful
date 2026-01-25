import Boussole from "./Boussole";
import { Content } from "./UI";

export const metadata = {
    title: "Boussole en ligne - Cartes.app",
    description:
        "La plus simple des boussoles en ligne ! Sans installation d'application. Accédez directement à cartes.app/nord depuis votre navigateur mobile.",
};

export default function BoussolePage() {
    return (
        <main>
            <Boussole />
            <Content>
                <h2>Boussole en ligne</h2>
                <p>
                    Testez <a href="https://cartes.app">cartes.app</a>, une alternative française en ligne à Google
                    Maps. Là non plus, aucune app à installer !
                </p>
            </Content>
        </main>
    );
}
