"use client";

import { PressEvent, Switch, useTheme } from "@heroui/react";

import { Moon, Sun } from "@gravity-ui/icons";

export function ThemeSwitch() {
    const {resolvedTheme, setTheme, theme} = useTheme("system");
    
    function changeTheme(darkMode: boolean): void {
        setTheme(darkMode ? "dark" : "light");
    };

    return (
        <Switch onChange={changeTheme}>
            {({isSelected}) => (
            <Switch.Content>
              <Switch.Control>
                <Switch.Thumb>
                  <Switch.Icon>
                    {isSelected ? (
                      <Moon className="size-3 text-inherit opacity-100" />
                    ) : (
                      <Sun className="size-3 text-inherit opacity-70" />
                    )}
                  </Switch.Icon>
                </Switch.Thumb>
              </Switch.Control>
            </Switch.Content>
          )}
        </Switch>
    );
};