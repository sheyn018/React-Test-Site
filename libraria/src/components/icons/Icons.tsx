import { Icon } from "@chakra-ui/react";
import { AiFillDelete, AiFillPlusCircle } from "react-icons/ai";
import { BsChevronDown, BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { IoArrowBack, IoSettingsOutline } from "react-icons/io5";
import { RxExternalLink } from "react-icons/rx";
import { FaCopy } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";

export const ExternalLinkIcon = (props) => <Icon as={RxExternalLink} {...props} />;

export const DeleteIcon = (props) => <Icon as={AiFillDelete} {...props} />;
export const ArrowBackIcon = (props) => <Icon as={IoArrowBack} {...props} />;
export const CopyIcon = (props) => <Icon as={FaCopy} {...props} />;
export const ChevronDownIcon = (props) => <Icon as={BsChevronDown} {...props} />;
export const ChevronLeftIcon = (props) => <Icon as={BsChevronLeft} {...props} />;
export const ChevronRightIcon = (props) => <Icon as={BsChevronRight} {...props} />;
export const SettingsIcon = (props) => <Icon as={IoSettingsOutline} {...props} />;
export const HamburgerIcon = (props) => <Icon as={FiMenu} {...props} />;
export const AddIcon = (props) => <Icon as={AiFillPlusCircle} {...props} />;
