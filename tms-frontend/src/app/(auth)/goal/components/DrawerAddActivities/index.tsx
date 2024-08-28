import Drawer from "@components/components/Drawer";
import { TItemGoal } from "@components/types/goal";
import React from "react";
interface Props {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  itemGoal: TItemGoal;
}
const DrawerAddActivitiesOnGoal = ({ isOpen, setIsOpen }: Props) => {
  return (
    <Drawer open={isOpen} onClose={() => setIsOpen(false)}>
      aaaaaaaaaaaaaaaaaaaa
    </Drawer>
  );
};

export default DrawerAddActivitiesOnGoal;
