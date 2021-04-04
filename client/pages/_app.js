// As we want css imported on every page, have to import it in this app file with wrapper.
import 'bootstrap/dist/css/bootstrap.css'
import buildClient from '../api/build-client';
import Header from '../components/header'

const AppComponent =  ({ Component, pageProps, currentUser }) => {
    console.log(Component)
    console.log(pageProps)

    return (
        <div>
            <Header currentUser={currentUser}></Header>
            <Component {...pageProps}></Component>
        </div>
    )
};

AppComponent.getInitialProps = async appContext => {
    const client = buildClient(appContext.ctx);
    const {data} = await client.get('api/users/currentUser');

    let pageProps = {};
    if(appContext.Component.getInitialProps){
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }

    return {
        pageProps,
        ...data
    };
}

export default AppComponent;