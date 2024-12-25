import { useEffect, useState } from 'react'
import sdk from '@stackblitz/sdk'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface CodeContainerProps {
  project: {
    files: { [key: string]: string };
    title: string;
    description: string;
    dependencies: { [key: string]: string };
  };
}

function CodeContainer({ project }: CodeContainerProps) {
  const { toast } = useToast()

  useEffect(() => {
    const stackblitzProject = {
      files: project.files,
      title: project.title,
      description: project.description,
      template: 'create-react-app' as const,
      dependencies: project.dependencies,
    };

    sdk.embedProject('embed-container', stackblitzProject, {
      height: 500,
      clickToLoad: false,
    });
  }, [project]);


  const onClickSave = async () => {
    try {
      const iframe = document.getElementById('embed-container') as HTMLIFrameElement
      const vm = await sdk.connect(iframe)
      const files: any = await vm.getFsSnapshot()

      await saveToMinioViaAPI(files)
    } catch (error) {
      console.error('Error getting files:', error)
      toast({
        title: "Error",
        description: "Failed to retrieve your code. Please try again.",
        variant: "destructive",
      })
    }
  }

  const saveToMinioViaAPI = async (files: { [key: string]: string }) => {
    try {
      const response = await fetch('http://localhost:3000/api/assignments/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: project.title, files })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Your code has been saved to MinIO via API.",
        })
      } else {
        throw new Error('Failed to save the code')
      }
    } catch (error) {
      console.error('Error saving code via API:', error)
      toast({
        title: "Error",
        description: "Failed to save your code to MinIO via API. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div id="embed-container" className="w-full h-[500px] border border-gray-200 rounded-md overflow-hidden"></div>
      </CardContent>
      <CardFooter>
        <Button onClick={onClickSave}>Save Code</Button>
      </CardFooter>
    </Card>
  )
}

export default CodeContainer

