import { useTranslation } from "react-i18next";
import Section from "../UI/Section";

function Search(props) {
    const {t} = useTranslation()
    return ( 
        <Section >
        <div className={"search"}>
        <input placeholder={t("search.search")} value={props.value} onChange={props.onChange} className={"input"} />
        </div>
        </Section>
     );
}

export default Search;