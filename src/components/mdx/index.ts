import Figure from "../Figure.astro";
import CodeBlock from "./CodeBlock.astro";
import EasingDemo from "./EasingDemo.astro";
import FootnotesSection from "./FootnotesSection.astro";
import Heading from "./Heading.astro";
import Link from "./Link.astro";
import ListItem from "./ListItem.astro";
import Note from "./Note.astro";
import OrderedList from "./OrderedList.astro";
import Quote from "./Quote.astro";
import RoleburnHero from "./RoleburnHero.astro";
import Summary from "./Summary.astro";
import Table from "./Table.astro";
import UnorderedList from "./UnorderedList.astro";

// Markdown elements mapped to components, and the components posts and case
// studies can use, for <Content components={mdxComponents} />.
export const mdxComponents = {
  a: Link,
  h2: Heading,
  li: ListItem,
  ol: OrderedList,
  pre: CodeBlock,
  section: FootnotesSection,
  summary: Summary,
  table: Table,
  ul: UnorderedList,
  EasingDemo,
  Figure,
  Note,
  Quote,
  RoleburnHero,
};
