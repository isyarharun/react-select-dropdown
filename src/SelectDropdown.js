import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import './SelectDropdown.css'

const SelectDropdown = ({
  searchable = false,
  multiple = false,
  options = [],
  trackBy,
  label,
}) => {
  const [searchText, setSearchText] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState([])
  const multiselectRef = useRef(null)

  const filteredOptions = options.filter((option) => {
    if (!searchText) {
      return true
    }
    const regex = new RegExp(`(${searchText})`, 'gi')
    return trackBy ? option[label].match(regex) : option.match(regex)
  })

  const highlightText = (text) => {
    if (!searchText) {
      return getOptionLabel(text)
    }
    const regex = new RegExp(`(${searchText})`, 'gi')
    return text.replace(regex, '<span class="highlight">$1</span>')
  }

  const getOptionLabel = (value) => {
    const selectedIndex = filteredOptions.findIndex((option) =>
      trackBy ? option[label] === value : option === value
    )
    if (selectedIndex !== -1) {
      return trackBy
        ? filteredOptions[selectedIndex][label]
        : filteredOptions[selectedIndex]
    }
    return ''
  }

  const onFocus = () => {
    setIsOpen(true)
  }

  const onBlur = () => {
    if (!searchable) {
      setIsOpen(false)
    }
  }

  const selectOption = (value) => {
    const selectedIndex = selectedOption.findIndex((option) =>
      trackBy ? option[trackBy] === value[trackBy] : option === value
    )
    const isSelected = selectedIndex > -1
    if (isSelected) {
      removeSelected(selectedIndex)
    } else {
      if (multiple) {
        setSelectedOption([...selectedOption, value])
      } else {
        setSelectedOption([value])
      }
    }
    setIsOpen(false)
  }

  const selectedClass = (value) => {
    const isSelected = selectedOption.some((option) =>
      trackBy ? option[trackBy] === value[trackBy] : option === value
    )
    return isSelected ? 'option-selected' : ''
  }

  const removeSelected = (selectedIndex) => {
    setSelectedOption(
      selectedOption.filter((_, index) => index !== selectedIndex)
    )
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        multiselectRef.current &&
        !multiselectRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [multiselectRef])

  return (
    <div
      id="multiselect"
      tabIndex={searchable ? -1 : 0}
      onClick={onFocus}
      className="multiselect"
      onBlur={searchable ? null : onBlur}
      ref={multiselectRef}
    >
      <div className="tags">
        <div className="tags-wrap">
          <div>
            {selectedOption.map((selected, index) => (
              <span className="tag" key={index}>
                <span>{trackBy ? selected[label] : selected}</span>
                <span
                  className="close-btn"
                  onClick={() => removeSelected(index)}
                >
                  x
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="selection-wrapper">
          {searchable && (
            <input
              className="input-text"
              tabIndex={0}
              placeholder="Search here"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onBlur={onBlur}
              onFocus={onFocus}
            />
          )}
          <ul className="options-wrapper">
            {searchText.length > 0 && filteredOptions.length === 0 ? (
              <div className="no-data">No data found</div>
            ) : (
              filteredOptions.map((option, index) => (
                <li
                  key={index}
                  className={`select-option ${selectedClass(option)}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    selectOption(option)
                  }}
                  dangerouslySetInnerHTML={{
                    __html: highlightText(trackBy ? option[label] : option),
                  }}
                />
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default SelectDropdown

SelectDropdown.propTypes = {
  /**
   * allow user to search on the dropdown
   */
  searchable: PropTypes.bool,
  /**
   * allow multiple selection
   */
  multiple: PropTypes.bool,
  /**
   * options to be selected, can array of strings or array of objects
   */
  options: PropTypes.array.isRequired,
  /**
   * if options is array of objects use track by
   */
  trackBy: PropTypes.string,
  /**
   * if options is array of objects use label
   */
  label: PropTypes.string,
}

SelectDropdown.defaultProps = {
  searchable: false,
  multiple: false,
  options: [],
  trackBy: '',
  label: '',
}
