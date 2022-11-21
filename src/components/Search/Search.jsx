import Section from "../UI/Section";
import classes from './Search.module.css'

function Search(props) {
    return ( 
        <Section >
        <div className={classes.search}>
        <input value={props.value} onChange={props.onChange} className={classes.input} />
        </div>
        </Section>
     );
}

export default Search;