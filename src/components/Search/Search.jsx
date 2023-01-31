import Section from "../UI/Section";

function Search(props) {
    return ( 
        <Section >
        <div className={"search"}>
        <input placeholder="Поиск" value={props.value} onChange={props.onChange} className={"input"} />
        </div>
        </Section>
     );
}

export default Search;