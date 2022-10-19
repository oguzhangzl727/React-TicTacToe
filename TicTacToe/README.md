### `yarn start`


### Material-UI

https://material-ui.com/getting-started/installation/


## 1: Material-UI App Bar


- `components/Header.js` içine AppBar componentı koyalım, style ekleyelim. (makeStyles kullanarak)
    
    https://material-ui.com/components/app-bar/

- Headerda Menu iconu bulunsun ve sekme olsun bunun için Menu kullanalım
    https://material-ui.com/components/menus/ 

- Menünün içinde 2 tane MenuItem olacak, biri HomePage, diğeri TicTacToe. 

- react-router-dom'daki Link kullanarak bu MenuItemlere basıldığında /home veya /tictactoe sayfasına yönlendirecek
    https://reactrouter.com/web/api/Link

## 2: React-Router Switch

- pages'ta yeni klasör oluşturulacak, adı Tictactoe. içine index.js koyalım

- App.js'in içinde Switch kullanarak bu oluşturulan index.js return edilecek

## 3: Material-UI Layout

- Bu index.js bir Container return edecek 
    https://material-ui.com/components/container/

- Container içinde bir grid olsun(container grid). Bu gridin içinde 3x3 grid oluşturmaya çalışalım. x-o-x oyunu tablosu gibi 
    https://material-ui.com/components/grid/

## 4: Material-UI Button

- Bir container grid daha olsun, bunun içinde ButtonGroup olsun
    https://material-ui.com/components/button-group/
    https://material-ui.com/components/buttons/

- 1. button: Start Game, 2. button: Resign

## 5: Material-UI Switch

- ButtonGroupların altında Switch olsun
    https://material-ui.com/components/switches/

- Switchin solunda "Go First" yazsın. (label kullanarak)

## 6: React useState

- [game, setGame] diye bir state olsun.
    https://reactjs.org/docs/hooks-reference.html#usestate
    https://stackoverflow.com/questions/53165945/what-is-usestate-in-react
```    
const [game, setGame] = useState({
    board:{
      "0,0": null,
      "0,1": null,
      "0,2": null,
      "1,0": null,
      "1,1": null,
      "1,2": null,
      "2,0": null,
      "2,1": null,
      "2,2": null,
    },
    playerStartsFirst: true,
    gameStarted: false,
    gameEnded: false
    winner: 'none',
})
```

## 7: Events & setState

- Koyduğumuz switchin valuesunu "game" statindeki "playerStartsFirst" booleanından çekelim. `<Switch ... value={game.playerStartsFirst} .../>`

- Switche "onChange" eventi ekleyelim. `<Switch... onChange={event=>setGame({...game, playerStartsFirst: event.target.checked})} .../>`

- Aynı işlemi eklediğimiz butona da yapalım. "Start game" butonu gameStarted booleanını true yapsın. "Resign" ise "gameEnded" true yapsın.

## 8: Functions & Click Handlers

- Bir fonksiyon yazacağız. alacağı parametreler (position, value) 
    Örneğin position= "1,0" ve value="X" verildiğinde game.board["1,0"] değeri 'X'e dönüşsün.

- 3x3 gridimizin her birine id verelim. ("0,1", "0,2" ...)

- Gridin her birine onClick eventi ekleyip bu fonksiyona girsin. (event.target.id ile verdiğimiz idleri çekebiliriz)

- Bir fonksiyon daha. Bize game.board'da sadece null olan değerleri array şeklinde dönsün. (Örneğin ["1,0","1,2","2,1"])

- Bir fonksiyon daha. Parametre olarak string arrayi alacak, bize sadece birini dönecek (Örneğin üstteki array parametre olarak geldi, returnleyeceği cevap "1,2")
