import {
  faExclamationCircle,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardBody, CardProps, Tab, Tabs } from "@nextui-org/react";
import React, { useEffect } from "react";

import { filterItems, ItemFeatureJson, ItemJson } from "@/server/db";

export interface ItemFilterProps {
  itemFeatures: ItemFeatureJson[];
  items: ItemJson[];
  setFilteredItems: React.Dispatch<React.SetStateAction<ItemJson[]>>;
  cardProps?: CardProps;
}

/**
 * ItemFilter component allows users to filter items based on their inclusion or exclusion criteria.
 *
 * @param {ItemFilterProps} props - The properties for the ItemFilter component.
 * @param {Array<Item>} props.items - The list of items to be filtered.
 * @param {Array<ItemFeature>} props.itemFeatures - The features of the items to be displayed as filter options.
 * @param {Function} props.setFilteredItems - The function to set the filtered items based on the selected criteria.
 * @param {Object} props.cardProps - Additional properties to be passed to the Card component.
 *
 * @returns {JSX.Element} The rendered ItemFilter component.
 *
 * @component
 *
 * @example
 * const items = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
 * const itemFeatures = [{ id: 1, name: 'Feature 1' }, { id: 2, name: 'Feature 2' }];
 * const setFilteredItems = (filteredItems) => console.log(filteredItems);
 *
 * <ItemFilter
 *   items={items}
 *   itemFeatures={itemFeatures}
 *   setFilteredItems={setFilteredItems}
 *   cardProps={{ className: 'custom-card' }}
 * />
 */
export const ItemFilter: React.FC<ItemFilterProps> = (props) => {
  const [included, setIncluded] = React.useState(new Set<number>());
  const [excluded, setExcluded] = React.useState(new Set<number>());

  useEffect(() => {
    props.setFilteredItems(
      filterItems(props.items, Array.from(included), Array.from(excluded)),
    );
  }, [props.items, included, excluded]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = parseInt(e.target.value);

    if (e.target.checked) {
      if (e.target.name === "include") {
        setIncluded((i) => new Set(i.add(id)));
        setExcluded((e) => {
          e.delete(id);

          return new Set(e);
        });
      } else if (e.target.name === "exclude") {
        setExcluded((e) => new Set(e.add(id)));
        setIncluded((i) => {
          i.delete(id);

          return new Set(i);
        });
      } else {
        setIncluded((i) => {
          i.delete(id);

          return new Set(i);
        });
        setExcluded((e) => {
          e.delete(id);

          return new Set(e);
        });
      }
    } else {
      if (e.target.name === "include") {
        setIncluded((i) => {
          i.delete(id);

          return new Set(i);
        });
      } else {
        setExcluded((e) => {
          e.delete(id);

          return new Set(e);
        });
      }
    }
  };

  return (
    <Card {...props.cardProps}>
      <CardBody>
        <div className="grid grid-cols-2 gap-4">
          {props.itemFeatures.map((itemFeature) => (
            <Tabs
              key={itemFeature.id}
              defaultSelectedKey="neither"
              title={itemFeature.name}
              onChange={handleChange}
            >
              <Tab
                key="include"
                title={<FontAwesomeIcon icon={faExclamationCircle} />}
              />
              <Tab key="neither" title={<FontAwesomeIcon icon={faEye} />} />
              <Tab
                key="exclude"
                title={<FontAwesomeIcon icon={faEyeSlash} />}
              />
            </Tabs>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
