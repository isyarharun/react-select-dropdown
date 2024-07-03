
# React Simple Multiselect

  

Please find the demo in [Demo](https://select-dropdown-demo.web.app/).

  

Also the storybook in [Storybook](https://select-dropdown-storybook.web.app/)

  

## Features & characteristics:

* NO dependencies

* Single select

* Multiple select

* Searchable

* Object Options

  

## Install & basic usage

  

```bash

npm  install  @isyarharun/react-simple-multiselect

```

  

## Examples

  

### Single select / dropdown

```jsx

<SelectDropdown

multiple={false}

searchable={false}

options={options}

/>

```

  

### Multiple select searchable

```jsx

<SelectDropdown

multiple={true}

searchable={true}

options={options}

/>

```

  

### Multiple select object

```jsx

<SelectDropdown

multiple={true}

searchable={true}

options={options}

trackBy="id"

label="label"

/>

```