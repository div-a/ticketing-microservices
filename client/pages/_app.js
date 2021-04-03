// As we want css imported on every page, have to import it in this app file with wrapper.
import 'bootstrap/dist/css/bootstrap.css'

export default ({Component, pageProps}) => {
    return <Component {...pageProps}></Component>
};