"use client";

import React from "react";
import { Header } from "@components/components/header";
import { Tabs } from "@components/components/tabs";
import Button from "@components/components/button";
import { ListContent } from './components'
import Container from "@components/components/container";
import { SideMenu } from "@components/components/side-menu";
import { MultipleSelect } from "@components/components/multiple-select";


interface DetailsOption {
    value: string;
    label: string;
}

interface DetailsTab {
    id: number;
    label: string;
    content: React.ReactNode;
}


export default function ActivitiesPage() {
    const [userName, setUserName] = React.useState<string>('Baymax')
    const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);

    const handleSelectChange = (selected: string[]) => {
        setSelectedOptions(selected);
    };

    const handleLogout = () => { }

    const handleCreateNewActivity = () => { }


    const categoryOptions: DetailsOption[] = [{ value: 'daily', label: 'Daily' }, { value: 'leisure', label: 'Leisure' }, { value: 'weekend', label: 'Weekend' }]
    const tabOptions: DetailsTab[] = [{
        id: 1, label: 'List', content: <ListContent />
    }, { id: 2, label: 'Visualization', content: <div>Visualization</div> }]

    return (
        <div className="min-h-screen bg-zinc-100">
            <Header userName={userName} onLogout={handleLogout} />
            <div className="flex">
                <SideMenu />
                <Container className="pt-10 pb-14">
                    <div className="flex justify-between items-center pb-4">
                        <div className="text-3xl font-bold">Your activities</div>
                        <div className="flex justify-center items-end gap-2">
                            <MultipleSelect
                                label="Filter categories"
                                name="exampleSelect"
                                options={categoryOptions}
                                selectedValues={selectedOptions}
                                onChange={handleSelectChange}
                                placeholder='Please select options'
                            />
                            <Button className="w-max" name="Create new activity" onClick={handleCreateNewActivity} />
                        </div>
                    </div>
                    <Tabs tabs={tabOptions} />
                </Container>
            </div>

        </div>
    );
}
