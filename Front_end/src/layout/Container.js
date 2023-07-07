import styles from './Container.module.css'



function Container(props){
//props.children=chama o filho, `${styles.container}`= criando Classe Container
return <div className={`${styles.container} ${styles[props.customClass]}`}>{props.children}</div>  


}
export default Container