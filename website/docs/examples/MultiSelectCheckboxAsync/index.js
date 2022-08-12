import React, { useEffect, useState } from "react";
import { FaSquare, FaCheckSquare, FaMinusSquare } from "react-icons/fa";
import { IoMdArrowDropright } from "react-icons/io";
import { AiOutlineLoading } from "react-icons/ai";
import TreeView from "react-accessible-treeview";
import cx from "classnames";
import "./styles.css";

const initialData = [
  {
    name: "",
    id: 0,
    children: [1, 2, 3],
    parent: null,
  },
  {
    name: "Fruits",
    children: [],
    id: 1,
    parent: 0,
    isBranch: true,
  },
  {
    name: "Drinks",
    children: [4, 5],
    id: 2,
    parent: 0,
    isBranch: true,
  },
  {
    name: "Vegetables",
    children: [],
    id: 3,
    parent: 0,
  },
  {
    name: "Pine colada",
    children: [],
    id: 4,
    parent: 2,
  },
  {
    name: "Water",
    children: [],
    id: 5,
    parent: 2,
  },
];

function AsyncMultiSelectCheckbox() {
  const [data, setData] = useState(initialData);

  const updateTreeData = (list, id, children) => {
    const data = list.map((node) => {
      if (node.id === id) {
        node.children = children.map((el) => {
          return el.id;
        });
      }
      return node;
    });
    return data.concat(children);
  };

  const onLoadData = ({ element }) => {
    new Promise((resolve) => {
      if (element.children.length > 0) {
        resolve();
        return;
      }
      setTimeout(() => {
        setData((value) =>
          updateTreeData(value, element.id, [
            {
              name: "Child Node",
              children: [],
              id: value.length,
              parent: element.id,
              isBranch: true,
            },
            {
              name: "Another child Node",
              children: [],
              id: value.length + 1,
              parent: element.id,
            },
          ])
        );
        resolve();
      }, 1000);
    });
  };

  return (
    <>
      <div>
        <div className="checkbox">
          <TreeView
            data={data}
            aria-label="Checkbox tree"
            onLoadData={onLoadData}
            multiSelect
            propagateSelect
            togglableSelect
            propagateSelectUpwards
            nodeRenderer={({
              element,
              isBranch,
              isExpanded,
              isSelected,
              isHalfSelected,
              getNodeProps,
              level,
              handleSelect,
              handleExpand,
            }) => {
              const branchNode = (isExpanded, element) => {
                return isExpanded && element.children.length === 0 ? (
                  <>
                    <span
                      role="alert"
                      aria-live="assertive"
                      className="visually-hidden"
                    >
                      loading {element.name}
                    </span>
                    <AiOutlineLoading
                      aria-hidden={true}
                      className="loading-icon"
                    />
                  </>
                ) : (
                  <ArrowIcon isOpen={isExpanded} />
                );
              };
              return (
                <div
                  {...getNodeProps({ onClick: handleExpand })}
                  style={{ marginLeft: 40 * (level - 1) }}
                >
                  {isBranch && branchNode(isExpanded, element)}
                  <CheckBoxIcon
                    className="checkbox-icon"
                    onClick={(e) => {
                      handleSelect(e);
                      e.stopPropagation();
                    }}
                    variant={
                      isHalfSelected ? "some" : isSelected ? "all" : "none"
                    }
                  />
                  <span className="name">{element.name}</span>
                </div>
              );
            }}
          />
        </div>
      </div>
    </>
  );
}

const ArrowIcon = ({ isOpen, className }) => {
  const baseClass = "arrow";
  const classes = cx(
    baseClass,
    { [`${baseClass}--closed`]: !isOpen },
    { [`${baseClass}--open`]: isOpen },
    className
  );
  return <IoMdArrowDropright className={classes} />;
};

const CheckBoxIcon = ({ variant, ...rest }) => {
  switch (variant) {
    case "all":
      return <FaCheckSquare {...rest} />;
    case "none":
      return <FaSquare {...rest} />;
    case "some":
      return <FaMinusSquare {...rest} />;
    default:
      return null;
  }
};

export default AsyncMultiSelectCheckbox;
