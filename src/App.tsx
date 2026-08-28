import Basic from "./examples/Basic";
import Custom from "./examples/Custom";
import ExampleBox from "./examples/ExampleBox";
import InitState from "./examples/InitState";
import TextBox from "./examples/TextBox";

function App() {
	return (
		<div className="py-10 flex flex-col gap-y-10 min-h-screen">
			<TextBox>
				<p>
					Die Data-Grid Komponente bietet eine tabellenartige Ansicht
					auf gewählte Daten und erlaubt es, diese zu sortieren,
					anders zu rendern, in diesen zu suchen, sie zu filtern und
					zu exportieren.
					<br></br>
					Das Design und der Aufbau ist von MUI inspiriert.
					<br></br>
					In den folgenden kleinen Beispielen werden die Funktionen
					knapp aufgezeigt.
					<br></br>
					<br></br>
					<a
						href="https://github.com/Prime0XX00/table"
						className="text-accent hover:underline"
						target="_blank"
					>
						GitHub Code
					</a>
				</p>
			</TextBox>
			<ExampleBox
				description={
					<p>
						Standard-Einstellungen des Grids. <br></br>
						Die Daten werden einfach nur angezeigt, wie sie der
						Komponente übergeben wurden. <br></br>
					</p>
				}
			>
				<Basic></Basic>
			</ExampleBox>
			<ExampleBox
				description={
					<p>
						In diesem Beispiel wurden der Aktivitätsstatus, der
						Lagerstatus, der Fortschritt und das Datum mit einer
						Render-Funktion versehen, um den Inhalt individuell zu
						gestalten und eine Node statt der eigentlichen Daten
						anzuzeigen.
						<br></br>
						Die Breiten einiger Spalten wurden zudem veändert.
						<br></br>
						Außerdem wurde das Produkt und der Aktivitätsstatus
						links angepinnt. Wenn die Tabelle breit genug ist und
						der Inhalt scrollbar wird, sind diese Spalten immer
						links sichtbar.
						<br></br>
					</p>
				}
			>
				<Custom></Custom>
			</ExampleBox>
			<ExampleBox
				description={
					<p>
						Dieses Grid wurde bereits mit Startwerten für Sortierung
						und Filterung versorgt und muss deshalb nicht spezifisch
						vom Nutzer eingestellt werden, um die gewünschten Daten
						zu erhalten.
						<br></br>
						Der Suchbegriff kann auch eingestellt werden.
					</p>
				}
			>
				<InitState></InitState>
			</ExampleBox>
		</div>
	);
}

export default App;
