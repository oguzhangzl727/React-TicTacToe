import {Route, Switch} from "react-router-dom";
import Homepage from './pages/Homepage'
import Header from './components/Header'
import Tictactoe from './pages/Tictactoe'

function App() {
    return (
        <div className={"App"}>
            <Header/>
            <Switch>
            <Route exact path={"/"} component={Homepage}/>
                <Route path={"/home"} component={Homepage}/>
                <Route path={"/tictactoe"} component={Tictactoe}/>
            </Switch>

            
                
            
        </div>)
}

export default App;
