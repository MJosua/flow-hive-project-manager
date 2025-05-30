import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@radix-ui/react-label";

const Register = () => {

    const [error, setError] = useState("")
    const handleRegister = (e) => {
        e.preventDefault();
    }

    const [userName, setUserName] = useState("")
    const [valueRadio, setValueRadio] = useState("")
    const [email, setEmail] = useState("")

    const handleValueChange = (e: string) => {
        setValueRadio(e)
        if (e.toLocaleString() === "option1") {
            setEmail(userName)
        } else {
            setEmail("")
        }
    }

    return (
        <div className="w-full">
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2x1 font-bold text-gray-900">
                            Register
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleRegister} className="space-y-1">

                            {error &&
                                <Alert variant="destructive">
                                    <AlertDescription>
                                        {error}
                                    </AlertDescription>
                                </Alert>
                            }

                            <div className="p-2 flex items-center justify-between">
                                <label className="text-sm font-medium">Username</label>
                                <Input className="w-3/4" value={userName} onChange={(e) => { setUserName(e.target.value) }} />
                            </div>
                            <div className="p-2 flex items-center justify-end">
                                <RadioGroup value={valueRadio} onValueChange={(e) => { handleValueChange(e) }}
                                    className="flex items-left gap-4 w-3/4">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="option1" id="r1" />
                                        <Label htmlFor="r1"> Indofood </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="option2" id="r2" />
                                        <Label htmlFor="r2"> Bina </Label>
                                    </div>

                                </RadioGroup>
                            </div>

                            <div className="p-2 flex items-center justify-between relative w-full max-w-sm">
                                <label className="text-sm font-medium">Email</label>
                                <Input
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value) }}
                                    className={`w-3/4 truncate overflow-hidden text-ellipsis ${valueRadio === "option1" ? "pr-40" : "pr-4" } `}
                                    disabled={!valueRadio}
                                />
                                {valueRadio === "option1" ?
                                    <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 text-sm pointer-events-none">
                                        @icbp.indofood.co.id
                                    </span>
                                    :
                                    <>
                                    </>
                                }

                            </div>
                            <div className="p-2  flex items-center justify-between">
                                <label className="text-sm font-medium">Password</label>
                                <Input className="w-3/4" type="password" />
                            </div>
                            <div>
                                <Button
                                    className="w-full mb-1 mt-3 bg-gray-500 text-white font-medium hover:bg-gray-600"
                                    type="submit"
                                >
                                    Enter Data
                                </Button>
                            </div>


                        </form>




                    </CardContent>

                </Card>
            </div>
        </div >

    )
}


export default Register;

